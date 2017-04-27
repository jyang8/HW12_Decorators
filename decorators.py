import time

# returns name of the function and its arguments
def wrapper(f):
    return lambda arg: str(f.func_name) + ': (' + str(arg) + ')\n'

# returns execution time of given function
def timer(f):
    def inner(arg):
        start = time.time()
        f(arg)
        end = time.time()
        return 'execution time: ' +  str(end - start)
    return inner  

@wrapper
#@timer
def foo(a):
    return a

@wrapper
#@timer
def fact(n):
    if n == 0:
        return 1
    else:
        return n * fact(n-1)


print foo('hello')
print fact(3)
