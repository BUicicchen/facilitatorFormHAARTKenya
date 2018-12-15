import pandas as pd
import pymongo as pm

myclient = pm.MongoClient("mongodb://localhost:27017")
mydb = myclient["passport_local_mongoose_express4v7"]
mycol = mydb["formschemas"]
# test = mycol.find()[0]
# col =[]
# for x in test.keys():
#     col += [x]
# # print (col)
# this code initializes a dataframe based on the current schema as of 4/12/2018
# dataframe = pd.DataFrame(columns =col)
# for x in mycol.find():
#     row =[]
#     print(x)
#     for y in col:
#         print (y)
        # row += x[y][0]
        # print row

cursor = mycol.find({})
df= pd.DataFrame(list(cursor))
# if no_id:
#         del df['_id']

df.to_csv("butts.csv")
