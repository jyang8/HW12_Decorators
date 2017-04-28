import time

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

@wrapper
#@timer
def factR(n):
    if n == 0:
        return 1
    else:
        return n * factR(n-1)

@wrapper
#@timer
def fact(n):
    x = 1
    while n > 1:
        x *= n
        n -= 1
    return x
    
print factR(4)
print fact(4)
