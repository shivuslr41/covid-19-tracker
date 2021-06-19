import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './InfoBox.css'
import CountUp from 'react-countup'

function InfoBox({ title, cases, total, active, isRed, isGreen, isGrey, ...props }) {
    if (!total) {
        return null
    }
    return (
        <Card className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"} ${isGreen && "infoBox--green"} ${isGrey && "infoBox--grey"}`} onClick={props.onClick}>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`"infoBox__cases" ${isRed && "infoBox__cases--red"} ${isGreen && "infoBox__cases--green"} ${isGrey && "infoBox__cases--grey"}`}>
                    <CountUp
                        end={cases}
                        duration={2.5}
                        separator=","
                    />
                </h2>
                <Typography className="infoBox__total" color="textSecondary">
                    <CountUp
                        end={total}
                        duration={3}
                        separator=","
                    />
                    <span>  (Total {title})</span>
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
