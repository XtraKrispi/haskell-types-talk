# Expressive

* Focus on WHAT more than HOW
* Composition of small functions allows for greater readability

  ``` language-haskell
  add x y = x + y
  multiply x y = x * y
  square x = x * x

  -- . is function composition, read this right to left
  doStuff :: Int -> Int
  doStuff = add 3 . multiply 5 . square . add 5

  doStuffToList :: [Int] -> Int
  doStuffToList = sum . map doStuff
  ```
* Type system allows for enforcing of business logic  