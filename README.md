# Use BullMQ and Keda for task management and scheduling

## Install
Install Keda to GKE
```
kubectl apply --server-side -f https://github.com/kedacore/keda/releases/download/v2.11.2/keda-2.11.2.yaml
```

Install Redis HPA on Keda:
```
export REDIS_IP=$(gcloud redis instances list --filter="name:myinstance " --format="value(HOST)" \
    --region=us-central1)
sed "s|REDIS_IP|${REDIS_IP}|g" redis-hpa.yaml | kubectl apply -f -
```
