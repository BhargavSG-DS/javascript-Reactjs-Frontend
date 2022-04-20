from asyncio.windows_events import NULL
from fastapi import FastAPI, Request,HTTPException,Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.security import(OAuth2PasswordRequestForm, OAuth2PasswordBearer)
from fastapi.staticfiles import StaticFiles
from fastapi_pagination import Page, add_pagination, paginate
from fastapi import File, UploadFile
from tortoise.contrib.fastapi import register_tortoise
from http import HTTPStatus
from authentication import *
from PIL import Image
from models import *
import secrets

# Intialize App
app = FastAPI()

# Setting path to token to authenticate the user
oath2_scheme = OAuth2PasswordBearer(tokenUrl='token')

#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Token api
@app.post('/token',tags=['Login Token'])
async def generate_token(form_data : OAuth2PasswordRequestForm = Depends()):
    token = await token_gen(form_data.username, form_data.password)
    return {"access_token": token, "token_type" : "Bearer"}

# Getting current authorized user
async def get_current_user(token : str = Depends(oath2_scheme)):
    try:
        decoded_token = jtoken.decode(token,credentials['SECRET'],algorithms=['HS256'])
        user = await User.get(username = decoded_token.get("username"))
    except:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Invalid username or password",
            headers={"WWW-Authenticate":"Bearer"}
        )
    return user

app.mount('/static',StaticFiles(directory='static'),name="static")

# Root / Index 
@app.get('/',tags=['Root'])
def root():
    return {'data':'Please Use /user or /product'}

#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# User Api
@app.post("/user/register", tags=['User'],status_code=HTTPStatus.CREATED)
async def sign_Up(user : user_pydanticIn):
    user_info = user.dict(exclude_unset=True)
    user_info["password"] = hash_password(user_info["password"])
    user_obj = await User.create(**user_info)
    new_user = await user_pydantic.from_queryset(user_obj)
    await send_verification([user_info['email']],user_info)
    return{
        "data" : f"Welcome to Filthrift, {new_user.username}, Thanks for Choosing Our Services, Please Verify your Email."
    }

templates = Jinja2Templates(directory="templates")

@app.get("/user/verify",tags=['User'],status_code=HTTPStatus.OK,response_class=HTMLResponse)
async def verify_email(request: Request,token : str):
    user =  await verify_token(token)
    if user and not user.is_verified:
        user.is_verified = True
        await user.save()
        return templates.TemplateResponse("verification.html",{"request" : request,"username" : user.username})
    else:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Invalid or expired Token",
            headers={"WWW-Authenticate":"Bearer"}
        )

@app.post("/user/login",tags=['User'],status_code=HTTPStatus.OK)
async def login(user : user_pydanticIn = Depends(get_current_user)):
    return {
        'status' : 'OK',
        'data' : {
            "profile" : user.profile_pic,
            "username" : user.username,
            "email" : user.email,
            "verified" : user.is_verified,
            "joined_on" : user.date_created,
        }
        }

@app.post("/user/upload/profile", tags=['User'],status_code=HTTPStatus.OK)
async def upload_profile(file:UploadFile = File(...),user: user_pydantic = Depends(get_current_user)):
    
    FILEPATH = "./static/profiles/"
    filename = file.filename
    extension = filename.split(".")[1]
    if extension not in ['png','jpg','jpeg']:
        raise HTTPException(
            status_code=HTTPStatus.NOT_ACCEPTABLE,
            detail="Please Upload a png or jpg.",
        )
        
    # Generate a random hex and add to to file-name to avoid duplication of profile images
    file_name = secrets.token_hex(10) + "." + extension
    _genFilename = FILEPATH + file_name
    _content = await file.read()
    
    with open(_genFilename,'wb') as file:
        file.write(_content)
        
    #Shrinking image size to save server space using PILLOW
    img = Image.open(_genFilename)
    img = img.resize(size=(200,200))
    file.close()
    
    profile = await User.get(username=user.username)
    
    # Just an extra layer of "majidar" security
    
    if(profile.username == user.username):
        profile.profile_pic = file_name
        await profile.save()
    else:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="You are not Authorized.",
        )
        
    return {'detail' : 'Profile Picture set'}

# Deleting user detail
@app.delete("/user/remove",tags=['User'],status_code=HTTPStatus.ACCEPTED)
async def delete_profile(user : user_pydanticIn = Depends(get_current_user)):
    _user = await user_pydantic.from_queryset(User.get(username=user.username))
    if _user['username'] == user.username:
        User.delete(username=_user['username'])
        return{
            "data" : "Your Profile Has been removed, Sorry to see you go."
        }
    else:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="You are not Authorized to perform this action.",
        )

# Update user details
@app.put("/user/update",tags=['User'],status_code=HTTPStatus.ACCEPTED)
async def change_profile(user : user_pydanticIn = Depends(get_current_user)):
    user_info = user.dict(exclude_unset=True)
    user_info["password"] = hash_password(user_info["password"])
    user_obj = await User.update_from_dict(**user_info)
    updated_user = await user_pydantic.from_queryset(user_obj)
    
    return{
        "data" : f"Your Profile Has been updated, {updated_user.username}."
    }

#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Product Api
@app.post("/product/upload",tags=['Products'],status_code=HTTPStatus.OK)
async def product_upload(product : product_pydanticIn, user : user_pydanticIn = Depends(get_current_user)):
    product = product.dict(exclude_unset=True)
    
    # Avoiding ZeroDivisionError
    if product["price"] > 0:
        product_obj = await Product.create(**product, user = user)
        product_obj = await product_pydantic.from_queryset(product_obj)
        
        return {'data' : product_obj}
    
    else:
        raise HTTPException(
            status_code=HTTPStatus.NOT_ACCEPTABLE,
            detail="Unacceptable entry, Please check the fields again.",
        )

# Pagination to limit products on current screen
@app.get('/product/all',tags=['Products'],status_code=HTTPStatus.OK,response_model=Page[product_pydantic])
async def get_products(category: str | None = None):
    
    # Providing Category query parameter for products
    if category != None:
        categorised_products = await product_pydantic.from_queryset(Product.get(category=category))
        if response == NULL:
            return {"data" : "No Products of that Category"}
        return paginate(categorised_products)
    else:    
        response = await product_pydantic.from_queryset(Product.all())
        return paginate(response)

@app.get('/product/{id}/info',tags=['Products'],status_code=HTTPStatus.OK)
async def get_product_by_id(id : int):
    item = await product_pydantic.from_queryset(Product.get(id=id))
    seller = await product_pydantic.from_queryset_single(Product.get(id = item["user"]))
    return {
        "data" : {
            "product_details" : item,
            "seller_details" : {
                "profile" : seller['profile_pic'],
                "name" : seller['username'],
                "email" : seller['email'],
                "rating" : seller['trust_score'],
            }
        }
    }


@app.delete('/product/{id}/remove',tags=['Products'],status_code=HTTPStatus.OK)
async def product_remove(id: int,user : user_pydanticIn = Depends(get_current_user)):
    item = await Product.get(id=id)
    seller = await product_pydantic.from_queryset_single(Product.get(id = item["user"]))
    
    if user.username == seller['username']:
        item.delete()    
    else:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Not Authorized to perform this action.",
        )
    return{'data' : 'The requested item has been removed.'}

# Product image
@app.post('/product/{id}/uploadImage',tags=['Products'],status_code=HTTPStatus.OK)
async def upload_product_image(id: int, file: UploadFile = File (...),user : user_pydanticIn = Depends(get_current_user)):
    
    FILEPATH = "./static/products/"
    filename = file.filename
    extension = filename.split(".")[1]
    if extension not in ['png','jpg','jpeg']:
        raise HTTPException(
            status_code=HTTPStatus.NOT_ACCEPTABLE,
            detail="Please Upload a png or jpg.",
        )
        
    # Generate a random hex and add to to file-name to avoid duplication of product image names
    file_name = secrets.token_hex(10) + "." + extension
    _genFilename = FILEPATH + file_name
    _content = await file.read()
    
    with open(_genFilename,'wb') as file:
        file.write(_content)
        
    #Limiting image size to save server space using PILLOW
    img = Image.open(_genFilename)
    img = img.resize(size=(470,960))
    file.close()
    
    product = await Product.get(id = id)
    owner = await product.user
    
    if owner.username == user.username:
        product.cover = file_name
        await product.save()
    else:
        raise HTTPException(
        status_code=HTTPStatus.UNAUTHORIZED,
        detail="You are not Authorized.",
        )
        
    return {'status' : 'Product Picture Uploaded','filename' : _genFilename}


# Register Models
register_tortoise(
    app,
    db_url = "sqlite://database.sqlite3",
    modules={"models" : ["models"]},
    generate_schemas=True,
    add_exception_handlers=True,
    )

# Adding Pagitation to app
add_pagination(app)