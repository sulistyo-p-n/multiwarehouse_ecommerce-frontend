#gcloud auth login
#Local: sh tag-and-push-images.sh multiwarehouse-447401

docker tag multiwarehouse_ecommerce-app:latest asia-southeast2-docker.pkg.dev/$1/multiwarehouse_ecommerce-app:latest
docker push asia-southeast2-docker.pkg.dev/$1/multiwarehouse_ecommerce-app:latest