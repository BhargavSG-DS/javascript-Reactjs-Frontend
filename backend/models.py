from email.policy import default
from unicodedata import category
import pydantic
from tortoise.models import Model
from tortoise import fields
from typing import List
from pydantic import BaseModel,EmailStr,validator
from datetime import datetime
from tortoise.contrib.pydantic import pydantic_model_creator


# User Pydantic model
class User(Model):
    id = fields.IntField(pk =True,index=True)
    profile_pic = fields.CharField(max_length=200,default="NoPic.jpg")
    username = fields.CharField(max_length=20, null = False, unique= True)
    email = fields.CharField(max_length=200, null = False, unique = True)
    password = fields.CharField(max_length=100, null = False)
    is_verified = fields.BooleanField(default=False)
    phone = fields.CharField(max_length=10, null = False)
    date_created = fields.DateField(auto_now=True,default=datetime.today)
    trust_score = fields.SmallIntField(default=0)
    
    # Setting valid input for rating/trust_score
    @validator('trust_score')
    def rate_limit(cls,v):
        if v not in range(0,6):
            raise ValueError('Rating cannot be more than 5 stars!')
        return v        
   
# Products Pydantic model 
class Product(Model):
    id = fields.IntField(pk =True,index=True)
    cover = fields.CharField(max_length=200, null=False, default = "productDefault.jpg" )
    name = fields.CharField(max_length=20, null = False)
    size = fields.CharField(max_length=1, null = False)
    fit = fields.CharField(max_length=10, null = False,default="Regular")
    trend = fields.CharField(max_length=20, default="Unspecified")
    material = fields.CharField(max_length=20, default="Unspecified")
    price = fields.DecimalField(max_digits=7, decimal_places=2)
    discount = fields.DecimalField(max_digits=2, decimal_places=0,default=0)
    date_uploaded = fields.DateField(auto_now=True,default=datetime.today)
    category = fields.CharField(max_length=20, null = False)
    seller = fields.ForeignKeyField("models.User", related_name="products",on_delete='CASCADE')

    # Setting valid input for fit
    @validator('fit')
    def _fitVal(cls,fit):
        if fit.lower() not in ['regular','slim','skinny','relaxed','loose']:
            raise ValueError('Not a type of fit.')
        return fit
    
    # Setting valid input for size
    @validator('size')
    def _sizeVal(cls,size):
        if size.lower() not in ['xs','s','m','l','xl','xxl','xxl']:
            raise ValueError('Not a size initial.')
        return size
    
    # Setting valid input for material
    @validator('material')
    def _materialVal(cls,material):
        if material.lower() not in ['cotton','rayon','nylon','wool','polyester','silk','denim']:
            raise ValueError('Material not regonized')
        return material
     
user_pydantic = pydantic_model_creator(User, name= "User", exclude =("is_verified",))
user_pydanticIn = pydantic_model_creator(User, name= "UserIn", exclude_readonly=True, exclude =("id","is_verified", "date_created", "trust_score", "profile_pic",))
user_pydanticOut = pydantic_model_creator(User, name="UserOut",exclude=("password",))

product_pydantic = pydantic_model_creator(Product, name = "Product")
product_pydanticIn = pydantic_model_creator(Product, name = "ProductIn", exclude_readonly=True,exclude =("seller","cover","id"))
