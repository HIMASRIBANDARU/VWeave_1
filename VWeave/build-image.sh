#test=`git branch | grep "*"`
#currentBranch=${test:2}

release_version=`cat version.txt`
build_version=`cat version.txt`.$(date '+%Y%m%d')

aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 989431465196.dkr.ecr.ap-south-1.amazonaws.com

chmod +x app/run.sh
docker build -t 989431465196.dkr.ecr.ap-south-1.amazonaws.com/vg-adminweb:$release_version -t 989431465196.dkr.ecr.ap-south-1.amazonaws.com/vg-adminweb:$build_version .
docker push 989431465196.dkr.ecr.ap-south-1.amazonaws.com/vg-adminweb --all-tags
