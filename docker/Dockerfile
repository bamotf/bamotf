# Use ruimarinho/bitcoin-core as base image
FROM ruimarinho/bitcoin-core:latest

ENV BITCOIN_DATA=/home/bitcoin/.bitcoin

# Set working directory
WORKDIR /home/bitcoin

# Copy startup script
COPY ./docker/start.sh .

# Ensure script is executable
RUN chmod +x start.sh

# Execute the script when the docker starts
ENTRYPOINT [ "./start.sh" ]