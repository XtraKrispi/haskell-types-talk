## Miscellaneous function stuff

Binary functions (those that take two arguments) can also be called *infix* as an option:

``` language-haskell
  add :: Int -> Int -> Int

  x = add 1 2 
  
  -- or
  
  y = 1 `add` 2
```

To avoid parentheses, Haskell provides the function application operator, which
can make things more readable, since function application associates to the left

``` language-haskell

  add :: Int -> Int -> Int

  main :: IO ()
  main = putStrLn (show (add 1 2))

  -- or

  main :: IO ()
  main = putStrLn $ show $ add 1 2

```