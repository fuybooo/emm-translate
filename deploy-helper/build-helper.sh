rm -rf checkjsFile.txt
rm -rf ../_app
cp -r ../app ../_app
javac Modify.java
java Modify ../app ../deploy-helper
javac ModifyHtml.java
java ModifyHtml ../app ../deploy-helper

