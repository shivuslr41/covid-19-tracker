import React, {useState, useEffect} from 'react'
import {Line} from "react-chartjs-2"
import numeral from "numeral"

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

const buildChartData = (data, casesType) => {
    const chartData = []
    let lastDataPoint
    for (let date in data.cases) {
        if (lastDataPoint) {
            const newDatapoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            }
            chartData.push(newDatapoint)
        }
        lastDataPoint = data[casesType][date]
    }
    return chartData
}

function LineGraph({casesType = "cases", ...props}) {
    const [data, setdata] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then(response => response.json())
            .then(data => {
                let chartData = buildChartData(data, casesType)
                setdata(chartData)
            })
        }
        fetchData()
    }, [casesType])

    return (
        <div className={props.className}>
            {data?.length > 0 && (
                <Line 
                    data={{
                        datasets: [
                            {
                                backgroundColor: `${casesType==="cases"?"red":`${casesType==="recovered"?"lightgreen":`${casesType==="deaths"?"grey":null}`}`}`,
                                borderColor: `${casesType==="cases"?"red":`${casesType==="recovered"?"lightgreen":`${casesType==="deaths"?"grey":null}`}`}`,
                                data: data,
                            }
                        ]
                    }}
                    options={options}
                />
            )}
        </div>
    )
}

export default LineGraph
