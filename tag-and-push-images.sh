#gcloud auth login
#Local: sh tag-and-push-images.sh multiwarehouse-447401

docker tag com.multiwarehouse.app/frontend.service:1.0-SNAPSHOT asia-southeast2-docker.pkg.dev/$1/com-multiwarehouse-app-repository/frontend.service:1.0-SNAPSHOT
docker push asia-southeast2-docker.pkg.dev/$1/com-multiwarehouse-app-repository/frontend.service:1.0-SNAPSHOT