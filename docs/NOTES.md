# Notes

## Authenticate to Google Cloud
https://cloud.google.com/docs/authentication/use-service-account-impersonation
For local development, you can authenticate by running (must have the Google Cloud CLI installed):
```bash
gcloud auth application-default login --impersonate-service-account SERVICE_ACCT_EMAIL
```
Replace `SERVICE_ACCT_EMAIL` with the email of the service account you want to impersonate.
