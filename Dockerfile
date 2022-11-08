# FROM minio/minio:edge

# CMD ["minio", "server", "/data"]

FROM docker.io/minio/minio:latest

COPY --from=docker.io/minio/mc:latest /usr/bin/mc /usr/bin/mc
RUN mkdir /buckets
RUN minio server /buckets & \
    server_pid=$!; \
    until mc alias set local http://localhost:9000 minioadmin minioadmin; do \
        sleep 1; \
    done; \
    mc mb local/bucket1; \
    echo this is file1 | mc pipe local/bucket1/file1; \
    echo this is file2 | mc pipe local/bucket1/file2; \
    kill $server_pid
ENV MINIO_ROOT_USER=testtest
ENV MINIO_ROOT_PASSWORD=testtest

CMD ["minio", "server", "/buckets", "--address", ":9000", "--console-address", ":9001"]
