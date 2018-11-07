## Partial Application

The benefits of currying are not immediately evident, but it can help to 
cut down on boilerplate code and increase expressiveness.

Here is an example:

``` language-haskell

  -- Print out the base string appended by the number passed in
  helper :: String -> Int -> String 
  helper base num = base ++ ": " ++ show num -- show is basically a toString method...sort of

  -- Verbose
  convert :: [Int] -> [String]
  convert ids = map (\id -> helper "test" id) ids

  -- Taking advantage of partial application
  convert :: [Int] -> [String]
  convert = map (helper "test")

```