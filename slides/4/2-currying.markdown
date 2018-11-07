## Currying

Functions in Haskell are *curried*, which means that in essence, every function takes
a single parameter.  You can see this in the type signature of a function:

``` language-haskell
  add :: Int -> Int -> Int -- Function application associates to the right

  -- So this is equivalent
  add :: Int -> (Int -> Int) -- This means add is the same as a function that
                             -- given an Int will return a function that itself
                             -- takes an Int as an argument
```

This is important because of what we can do with this knowledge, and Haskell
abstracts that away for us.

These are perfectly valid ways to call a function:

``` language-haskell
  add :: Int -> Int -> Int
  add a b = a + b

  x = add 1 2 -- returns 3

  y = add 1   -- returns a new function Int -> Int

  z = add     -- returns a function Int -> Int -> Int
```
