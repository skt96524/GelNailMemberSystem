set -e
set -x

yarn build 

docker build -t hardyleung/gelnail:latest .
# docker push hardyleung/gelnail:latest
# ssh hardy "docker pull hardyleung/gelnail:latest"

docker save hardyleung/gelnail:latest | ssh hardy "docker load"

scp docker-compose.yml hardy:~/

rsync -SavLP uploads-sample/* hardy:~/uploads/

ssh hardy "docker compose up -d"
