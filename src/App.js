import './App.css'
import {
    MenuItem,
    FormControl,
    Select,
    Card,
    CardContent,
} from "@material-ui/core"
import { useEffect, useState } from 'react'
import InfoBox from './InfoBox'
import MapContainer from './Map'
import Table from './Table'
import { sortData } from './util'
import LineGraph from './LineGraph'
import 'leaflet/dist/leaflet.css'

function App() {
    const [countries, setCountries] = useState([])
    const [country, setCountry] = useState("worldwide")
    const [countryInfo, setCountryInfo] = useState([])
    const [tableData, setTableData] = useState([])
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
    const [mapZoom, setMapZoom] = useState(3)
    const [mapCountries, setMapCountries] = useState([])
    const [casesType, setCasesType] = useState("cases");

    useEffect(() => {
        fetch("http://disease.sh/v3/covid-19/all")
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data)
            })
    }, [])

    useEffect(() => {
        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => (
                        {
                            name: country.country,
                            value: country.countryInfo.iso2
                        }
                    ))

                    setCountries(countries)
                    setMapCountries(data)
                    let sortedData = sortData(data)
                    setTableData(sortedData)
                })
        }

        getCountriesData()
    }, [])

    const onCountryChange = async (e) => {
        const countryCode = e.target.value

        const url = countryCode === 'worldwide'
            ? 'https://disease.sh/v3/covid-19/all'
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`

        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCountry(countryCode)
                setCountryInfo(data)
                setMapCenter(countryCode === "worldwide" ? { lat: 34.80746, lng: -40.4796 } : { lat: data.countryInfo.lat, lng: data.countryInfo.long })
                setMapZoom(countryCode === "worldwide" ? 2.5 : 4)
            })
    }

    return (
        <div className="app">
            <div className="app__left">
                <div className="app__header">
                    <h1>COVID-19 TRACKER</h1>
                    <FormControl className="app__dropdown">
                        <Select
                            varient="outlined"
                            onChange={onCountryChange}
                            value={country}
                        >
                            <MenuItem value="worldwide">Worldwide</MenuItem>
                            {countries.map((country) => (
                                <MenuItem value={country.value}>{country.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className="app__stats">
                    <InfoBox
                        onClick={(e) => setCasesType("cases")}
                        active={casesType === "cases"}
                        isRed
                        title="Coronavirus Cases"
                        cases={countryInfo.todayCases}
                        total={countryInfo.cases}
                    />
                    <InfoBox
                        onClick={(e) => setCasesType("recovered")}
                        active={casesType === "recovered"}
                        isGreen
                        title="Recovered"
                        cases={countryInfo.todayRecovered}
                        total={countryInfo.recovered}
                    />
                    <InfoBox
                        onClick={(e) => setCasesType("deaths")}
                        active={casesType === "deaths"}
                        isGrey
                        title="Deaths"
                        cases={countryInfo.todayDeaths}
                        total={countryInfo.deaths}
                    />
                </div>

                <MapContainer
                    countries={mapCountries}
                    casesType={casesType}
                    center={mapCenter}
                    zoom={mapZoom}
                />
            </div>

            <div className="app__right">
                <Card>
                    <CardContent>
                        <h3>Live cases by country</h3>
                        <Table countries={tableData}></Table>
                        <h3 className="app__graphTitle">worldwide new {casesType}</h3>
                        <LineGraph className="app__graph" casesType={casesType} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default App
