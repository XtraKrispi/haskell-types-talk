--------------------------------------------------------------------------------
{-# LANGUAGE OverloadedStrings #-}
import           Data.Semigroup                           ( (<>) )
import           Data.List                                ( sortBy )
import           System.FilePath                          ( takeFileName, takeExtension )
import           Data.List.Split                          ( splitOn )
import           Data.Binary                              ( Binary )
import           Data.Typeable                            ( Typeable )
import           Hakyll
import           Text.Pandoc


--------------------------------------------------------------------------------
main :: IO ()
main = hakyll $ do
  match "images/*" $ do
    route idRoute
    compile copyFileCompiler
  
  match "js/*" $ do
    route idRoute
    compile copyFileCompiler
    
  match "css/*" $ do
    route idRoute
    compile compressCssCompiler

  match "slides/*" $ do
    route $ setExtension "html"
    compile
      $   getResourceFilePath
      >>= markdownOrHtmlCompiler
      >>= loadAndApplyTemplate "templates/default.html" defaultContext
      >>= relativizeUrls
    
  match "slides/**/*" $ do
    route $ setExtension "html"
    compile
      $   getResourceFilePath
      >>= markdownOrHtmlCompiler
      >>= loadAndApplyTemplate "templates/default.html"    defaultContext
      >>= relativizeUrls
    

  match "index.html" $ do
    route idRoute
    compile $ do
      slides <- sortSlides <$> loadAll "slides/*"
      debugCompiler $ "Slides: " ++ show slides
      let indexCtx =
            listField "slides" slideCtx (return slides) <> defaultContext

      getResourceBody
        >>= applyAsTemplate indexCtx
        >>= loadAndApplyTemplate "templates/default.html" indexCtx
        >>= relativizeUrls

  match "templates/*" $ compile templateCompiler


--------------------------------------------------------------------------------
markdownOrHtmlCompiler :: FilePath -> Compiler (Item String)
markdownOrHtmlCompiler fp = 
  case takeExtension fp of
    ".markdown" -> pandocCompilerWith (defaultHakyllReaderOptions{ readerExtensions = disableExtension Ext_smart pandocExtensions }) defaultHakyllWriterOptions
    _           -> getResourceBody

getChildren :: (Binary a, Typeable a, Show a) => Item a -> Compiler [Item a]
getChildren (Item identifier _) = do
  let ord = parseIdentifier identifier
  children <- sortSlides <$> loadAll (fromGlob $ "slides/" ++ show ord ++ "/*")
  debugCompiler (show children)
  return children

slideCtx :: Context String
slideCtx =
  listFieldWith "childSlides" defaultContext getChildren <> defaultContext

sortSlides :: [Item a] -> [Item a]
sortSlides = sortBy
  (\(Item id1 _) (Item id2 _) ->
    compare (parseIdentifier id1) (parseIdentifier id2)
  )

parseIdentifier :: Identifier -> Int
parseIdentifier identifier =
  let parts = splitOn "-" $ takeFileName $ toFilePath identifier
  in  case parts of
        []      -> 0
        (x : _) -> read x


