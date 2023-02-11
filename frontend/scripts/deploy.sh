set -e
yarn build
aws s3 sync build s3://gelnail-frd
aws cloudfront create-invalidation --distribution-id E169ZCA0ONPPBO --paths '/*'