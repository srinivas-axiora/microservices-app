pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        DOCKERHUB_USERNAME = 'srinivas5044'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Login') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Build & Push Catalog Service') {
            steps {
                dir('catalog-service') {
                    sh '''
                        docker build -t $DOCKERHUB_USERNAME/catalog-service:${BUILD_NUMBER} -t $DOCKERHUB_USERNAME/catalog-service:latest .
                        docker push $DOCKERHUB_USERNAME/catalog-service:${BUILD_NUMBER}
                        docker push $DOCKERHUB_USERNAME/catalog-service:latest
                    '''
                }
            }
        }

        stage('Build & Push Cart Service') {
            steps {
                dir('cart-service') {
                    sh '''
                        docker build -t $DOCKERHUB_USERNAME/cart-service:${BUILD_NUMBER} -t $DOCKERHUB_USERNAME/cart-service:latest .
                        docker push $DOCKERHUB_USERNAME/cart-service:${BUILD_NUMBER}
                        docker push $DOCKERHUB_USERNAME/cart-service:latest
                    '''
                }
            }
        }

        stage('Build & Push Shipping Service') {
            steps {
                dir('shipping-service') {
                    sh '''
                        docker build -t $DOCKERHUB_USERNAME/shipping-service:${BUILD_NUMBER} -t $DOCKERHUB_USERNAME/shipping-service:latest .
                        docker push $DOCKERHUB_USERNAME/shipping-service:${BUILD_NUMBER}
                        docker push $DOCKERHUB_USERNAME/shipping-service:latest
                    '''
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                dir('frontend/ecommerce-frontend') {
                    sh '''
                        docker build -t $DOCKERHUB_USERNAME/frontend:${BUILD_NUMBER} -t $DOCKERHUB_USERNAME/frontend:latest .
                        docker push $DOCKERHUB_USERNAME/frontend:${BUILD_NUMBER}
                        docker push $DOCKERHUB_USERNAME/frontend:latest
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'All images built and pushed to Docker Hub!'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
        always {
            sh 'docker logout'
        }
    }
}
