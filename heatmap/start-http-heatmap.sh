cd "$(dirname "$0")"

if [ ! -d log ]; then
    mkdir log
fi

nohup python http-heatmap.py > ./log/http_heatmap_err`date +%Y%m%d`.log 2>&1 &
