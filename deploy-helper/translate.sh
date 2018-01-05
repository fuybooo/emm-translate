# /src/deploy-helper

# 删除.translate
rm -rf ../.translate
# 复制
cp -r ../app ../.translate
# 替换
javac Translate.java
java Translate

