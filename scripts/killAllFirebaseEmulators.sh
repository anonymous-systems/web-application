#!/bin/bash

ports=(9099 5000 5001 8080 9000 8085 9199 4000 4001)

for port in "${ports[@]}"; do
    pids=$(lsof -ti:"$port")

    if [ -n "$pids" ]; then
      echo "Terminating processes using port $port:"
      for pid in $pids; do
        echo " - PID $pid"
        kill -9 "$pid"
        done
    fi
done
