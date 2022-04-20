from bcrypt import gensalt,hashpw
from passlib.context import CryptContext
from fastapi import BackgroundTasks, UploadFile, File, Form, Depends,HTTPException
from fastapi_mail import MessageSchema,FastMail,ConnectionConfig
from pydantic import BaseModel
from typing import List
from models import User
import jwt as jtoken
from dotenv import dotenv_values

from http import HTTPStatus


pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# Hash function to encrypt User: Password
def hash_password(password):
    return pwd_context.hash(password)

#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

credentials = dotenv_values(".env")

config = ConnectionConfig(
    MAIL_USERNAME= credentials['EMAIL'],
    MAIL_PASSWORD= credentials['PASSWORD'],
    MAIL_FROM=credentials['EMAIL'],
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT= 587,
    MAIL_TLS= True,
    MAIL_SSL= False,
    USE_CREDENTIALS=True,
)


# Verification mail to be sent on Sign-up   
async def send_verification(email:List,user):
    
    token = {
        "username" : user['username'],
    }
    
    tokengen = jtoken.encode(token,credentials["SECRET"],algorithm='HS256')
    
    template = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
    </head>
    <body>
        <div style="display: flex; align-items:center; justify-content: center;border-radius:1rem;background-color: rgb(122, 122, 122);margin: 5%;padding :5%;">
            <div style="border: .1rem solid black ;border-radius:.5rem; padding:5%; background-color : white">
                <blockquote>
                    <h2 style="text-align:center; font-family: 'Franklin Gothic Medium';">Email Confirmation</h2>
                </blockquote>
                <figcaption>
                    "Thanks For Choosing Filthrift, Please Click on the Below Button to verify your account."
                </figcaption>
                <div style="text-align:center; background-color: rgb(255, 255, 255); width:50% ;margin: auto; margin-top: 3rem; border:.1rem solid black; padding: .5rem;border-radius:1rem;">
                    <a href="http://localhost:8000/user/verify/?token={tokengen}" style="text-decoration: none; color : black;">Verify your Email!</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    mail_message = MessageSchema(
        subject='Filthrift Account Verification',
        recipients=email,
        body=template,
        subtype="html"
    )
    mail = FastMail(config=config)
    await mail.send_message(mail_message)
# -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


# Token Verification
async def verify_user(passwordPlain,passwordEncrypted):
    return pwd_context.verify(passwordPlain,passwordEncrypted)

async def verify_token(token :str):
    try:
        payload = jtoken.decode(token, credentials['SECRET'], algorithms=['HS256'])
        user = await User.get(username = payload.get("username"))
    except:
        raise HTTPException(
            status_code=HTTPStatus.NOT_ACCEPTABLE,
            detail="Invalid Token",
            headers={"WWW-Authenticate":"Bearer"}
        )
    return user


# User Authentication
async def authenticate(username,password):
    user = await User.get(username=username)
    if user and await verify_user(password, user.password):    
        return user
    return False


# Token Generation
async def token_gen(username :str, password :str):
    user = await authenticate(username, password)
    if not user:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Invalid User, Please Check Your Credentials.",
            headers={"WWW-Authenticate":"Bearer"}
        )
    
    token_data = {
        "username" : user.username,
    }
    token = jtoken.encode(token_data,credentials['SECRET'])
    return token