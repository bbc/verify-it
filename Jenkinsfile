pipeline {
  agent any
  environment {
    FORCE_COLOR = 1
  }
  options {
    ansiColor('xterm')
  }
  stages {

    stage('Checkout') {
      steps {
        script {
          gitCheckout([ githubProjectName: 'verify-it' ])
        }
      }
    }

    stage('Build and Test') {
      steps {
        sh '''
          npm install
          npm test
        '''
      }
    }

    stage('Release') {
      steps {
        script {
          def versionOutput = sh(script: 'npm version', returnStdout: true).trim()
          def jsonSlurper = new groovy.json.JsonSlurper()
          def versionInfo = jsonSlurper.parseText(versionOutput)
          def version = versionInfo['verify-it']

          def tagExists = sh(script: "git ls-remote --tags | grep $version", returnStdout: true).trim()

          if (tagExists) {
            echo "Release $version already exists -- skipping tagging of release"
          } else {
            tagRelease([ release: version ])
          }
        }
      }
    }
  }

  post { 
      always { 
        junit allowEmptyResults: true, testResults: 'test/test-reports/*.xml'
        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'coverage', reportFiles: 'index.html', reportName: 'Coverage Report', reportTitles: ''])
      }
    }
}
