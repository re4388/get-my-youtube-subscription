# echo $1

# this is my page token, you need to use your own to make it work
# each get request will let you know the pagetoken for the next page
# 50-100 CDIQAA
# 100-150 CGQQAA
# 150-200 CJYBEAA
# 200-250 CMgBEAA
# 250-300 CPoBEAA
# 300-350 CKwCEAA
# 350-400 CN4CEAA

pageToken="page1 CDIQAA CGQQAA CJYBEAA CMgBEAA CPoBEAA CKwCEAA CN4CEAA"
for val in $pageToken; do
    echo "run $val..."
    node fetchSub.js $val $1
    sleep 10
done

# ./run.sh csv
# ./run.sh json