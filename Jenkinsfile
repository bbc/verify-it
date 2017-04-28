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
          def version = sh(script: '''node -e "console.log(require('./package.json').version)"''', returnStdout: true).trim()
          def tagExists = sh(script: "git ls-remote --tags -q git@github.com:bbc/verify-it.git $version", returnStdout: true).trim()

          if (tagExists) {
            echo "Release $version already exists -- skipping tagging of release"
          } else {
            tagRelease([ release: version, releaseTitle: 'Release' ])
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
