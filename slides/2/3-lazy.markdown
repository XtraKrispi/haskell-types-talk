# Lazy

* Nothing is evaluated until it is needed
* The compiler and run time can utilize laziness for performance
* Can make debugging difficult, and can sometimes cause performance issues
* Because of laziness, this is possible:
  
    ``` haskell
      x = [0,1..] -- Infinite list
      y = ['a', 'b', 'c']
      indexed = zip x y 
      -- Produces [(0, 'a'), (1, 'b'), (2, 'c')]
    ``` 