from flask import Flask, render_template, request
from utils import parser as data
import json
import time


app = Flask(__name__)
app.secret_key = "eliasgoestostanford"


# returns name of the function and its arguments
def wrapper(f):
    def inner(*args):
        print str(f.func_name) + ': (' + str(*args) + ')'
        return f(*args)
    return inner
            
# returns execution time of given function
def timer(f):
    start = time.time()
    def inner(*args):        
        f(*args)
        end = time.time()
        return 'execution time: ' +  str(end - start)
    return inner


@app.route("/", methods=['POST','GET'])
@wrapper
@timer
def root():

    #default first year, default high school
    result = data.getHPercentages('2002')

    return render_template("page.html", states = result)


@app.route("/newData", methods=['POST','GET'])
def new():

    request.args['year', 'school']

    if ( school == "College" ):
        result = data.getCPercentages(year)
    else:
        result = data.getHPercentages(year)

    return render_template("page.html", states = result)

@app.route("/getCollege")
def collegeData():
    year = request.args["year"]
    return json.dumps(data.getCPercentages(year))

@app.route("/getHS")
def hsData():
    year = request.args["year"]
    return json.dumps(data.getHPercentages(year))

if __name__ == '__main__':
    app.debug = True
    app.run()
