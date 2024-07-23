# To get env variable set, run this command: "source ./setToken.sh"
export token=$(az account get-access-token | awk -F'"' '/accessToken/ {print $4}')