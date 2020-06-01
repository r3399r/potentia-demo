# Potentia-Demo

This repository is for the interview assignment of front-end work of Potential.

# Require

- `nodejs`: we use `npm` to manage the required packages.

# How-to deploy

1. `git clone`, clone this repository to local
2. open the terminal and run `npm run install` to install required packages
3. run `npm run serve` to deploy the web locally
4. run `npm run test` to check the unit test and run `npm run test:coverage` to generate the unit test report about the code coverage

# Static Website Host

We can run `npm run deploy` to publish the compiled result to s3 and we can check it online. Note that this step need the user to configure `aws configure` with specific IAM account.

Try it: http://y-potentia-demo.s3-website-ap-northeast-1.amazonaws.com