import React, { useState, useEffect, useMemo } from 'react'
import SideBar from './Sidebar'
import { doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import './CSS/dashboard.css'
import {
  Button,
  Row,
  Col,
  Container,
  Card,
  OverlayTrigger,
  Stack,
  Popover,
  ProgressBar
} from 'react-bootstrap'
import ReactSpeedometer from 'react-d3-speedometer'
import HeatMap from 'react-heatmap-grid'
import Select from 'react-select'
import {
  Chart as ChartJS,
  ArcElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { PolarArea, Pie, Chart, Bar, Line } from 'react-chartjs-2'

export default function Dashboard () {
  const tdyDate = new Date()
  const yr = tdyDate.getFullYear()
  const mth = tdyDate.getMonth()
  const date = tdyDate.getDate()
  const day = tdyDate.getDay()

  const weeks = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  // Get data from Firebase
  const userRef = doc(db, 'Users', auth.currentUser.uid)
  const [stressData, setStressData] = useState([])
  const [sleepData, setSleepData] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [allTags, setAllTags] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [noSems, setNoSems] = useState(0)
  const [allMods, setAllMods] = useState([])

  const getAllEvents = async () => {
    const docu = await getDoc(userRef)
    setStressData(docu.data().stress)
    setSleepData(docu.data().sleep)
    setAllEvents(docu.data().events)
    setAllTags(docu.data().tags)
    setNoSems(docu.data().noOfSems)
    setAllMods(docu.data().modgradeinfo)
    setLoaded(true)
  }

  useEffect(() => {
    getAllEvents()
  }, [])

  // chartjs test data
  ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    PointElement,
    BarElement,
    LineElement,
    ArcElement,
    Title,
    Filler,
    Tooltip,
    Legend
  )

  // Calculate average hours
  const calcHoursAvg = (dat) => {
    let sum = 0
    dat.forEach(function (i) {
      sum += i.hours
    })
    return (sum / dat.length).toFixed(2)
  }

  /// //////////////////////////////////////////////////////////////////////////////////////////////////
  // CAP //
  /// //////////////////////////////////////////////////////////////////////////////////////////////////

  // Data for CAP and CAP change multitype chart
  const gradesMultitypeOptions = {
    responsive: true,
    animation: {
      duration: 600
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'CAP by Semester and Changes in CAP'
      }
    }
  }

  const convertNumToSem = (n) => {
    return 'Y' + Math.ceil(n / 2) + 'S' + [2, 1][n % 2]
  }

  const calcCAP = (arr, s) => {
    const gradeToCAP = {
      'A+': 5,
      A: 5,
      'A-': 4.5,
      'B+': 4,
      B: 3.5,
      'B-': 3,
      'C+': 2.5,
      C: 2,
      'D+': 1.5,
      D: 1,
      F: 0
    }
    let res = 0
    let count = 0
    arr.map((i) => {
      if (
        i.grade !== 'SU' &&
        i.grade !== '' &&
        i.sem === s &&
        i.grade !== 'Not taken'
      ) {
        count += 1
        res += gradeToCAP[i.grade]
      }
    })
    return (res / count).toFixed(2)
  }

  const calcCAPTwo = (arr) => {
    const gradeToCAP = {
      'A+': 5,
      A: 5,
      'A-': 4.5,
      'B+': 4,
      B: 3.5,
      'B-': 3,
      'C+': 2.5,
      C: 2,
      'D+': 1.5,
      D: 1,
      F: 0
    }
    let res = 0
    let count = 0
    arr.map((i) => {
      if (i !== 'SU' && i !== '' && i !== 'Not taken') {
        count += 1
        res += gradeToCAP[i]
      }
    })
    return (res / count).toFixed(2)
  }

  const [semArr, setSemArr] = useState([])
  useEffect(() => {
    for (let i = 1; i <= noSems; i++) {
      setSemArr((semArr) => [...semArr, convertNumToSem(i)])
    }
  }, [noSems])

  const [capArr, setCapArr] = useState([])
  const [changeCapArr, setChangeCapArr] = useState([])

  const calcOverallCAP = (arr) => {
    const gradeToCAP = {
      'A+': 5,
      A: 5,
      'A-': 4.5,
      'B+': 4,
      B: 3.5,
      'B-': 3,
      'C+': 2.5,
      C: 2,
      'D+': 1.5,
      D: 1,
      F: 0
    }
    let res = 0
    let count = 0
    arr.map((i) => {
      if (i.grade !== 'SU' && i.grade !== '' && i.grade !== 'Not taken') {
        count += 1
        res += gradeToCAP[i.grade]
      }
    })
    return (res / count).toFixed(2)
  }

  const shortCode = (i) => {
    const validCode = new RegExp('^[A-Za-z]$')
    let res = ''
    i.split('').forEach((j) => {
      if (validCode.test(j)) {
        res += j
      }
    })
    return res
  }

  const [subCAP, setsubCAP] = useState(0)

  const [topFiveCode, settopFiveCode] = useState([])
  const [topFiveCAP, settopFiveCAP] = useState([])

  useEffect(() => {
    for (let i = 1; i <= noSems; i++) {
      setCapArr((capArr) => [...capArr, calcCAP(allMods, i)])
    }

    setChangeCapArr([0])
    for (let i = 2; i <= noSems; i++) {
      setChangeCapArr((changeCapArr) => [
        ...changeCapArr,
        calcCAP(allMods, i) - calcCAP(allMods, i - 1)
      ])
    }

    if (calcOverallCAP(allMods) === 'NaN') {
      setsubCAP(0)
    } else {
      setsubCAP(calcOverallCAP(allMods))
    }

    const allCodes = {}
    allMods.forEach((i) => {
      allCodes[shortCode(i.code + '')] = 0
    })
    allMods.forEach((i) => {
      allCodes[shortCode(i.code + '')] = allCodes[shortCode(i.code + '')] + 1
    })

    const allCodesArr = []
    Object.keys(allCodes).map((k, ind) => {
      allCodesArr.push({ code: k, count: allCodes[k] })
    })

    const sortedallCodesArr = [...allCodesArr].sort((a, b) =>
      a.count > b.count ? -1 : 1
    )
    const topFiveArr = []

    for (let i = 0; i < 5; i++) {
      if (sortedallCodesArr[i] !== undefined) {
        topFiveArr.push(sortedallCodesArr[i].code)
      }
    }

    const topFiveCAPArr = []
    topFiveArr.forEach((i) => {
      const moodDataArr = []
      allMods.forEach((m) => {
        if (i === shortCode(m.code)) {
          moodDataArr.push(m.grade)
        }
      })
      topFiveCAPArr.push(calcCAPTwo(moodDataArr))
    })

    settopFiveCode(topFiveArr)
    settopFiveCAP(topFiveCAPArr)
  }, [allMods])

  const [gradesMultitypeData, setgradesMultitypeData] = useState({
    labels: ['Y1S1', 'Y1S2', 'Y2S1', 'Y2S2', 'Y3S1', 'Y3S2', 'Y4S1', 'Y4S2'],
    datasets: [
      {
        type: 'line',
        label: 'Change in CAP',
        borderColor: 'rgb(255,85,85)',
        borderWidth: 2,
        fill: false
      },
      {
        type: 'bar',
        label: 'CAP',
        backgroundColor: 'rgba(159, 243, 233, 0.6)',
        borderColor: 'rgb(75, 151, 75)',
        borderWidth: 2
      }
    ]
  })

  useMemo(() => {
    setgradesMultitypeData({
      labels: semArr,
      datasets: [
        {
          type: 'line',
          label: 'Change in CAP',
          borderColor: 'rgb(255,85,85)',
          borderWidth: 2,
          fill: false,
          data: changeCapArr
        },
        {
          type: 'bar',
          label: 'CAP',
          backgroundColor: 'rgba(159, 243, 233, 0.6)',
          borderColor: 'rgb(75, 151, 75)',
          data: capArr,
          borderWidth: 2
        }
      ]
    })
  }, [capArr])

  // Data for mod grades polar area chart
  const gradesPolarOptions = {
    responsive: true,
    animation: {
      duration: 600
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Average Grades for Top 5 Most Common Module Codes'
      }
    }
  }

  const [gradesPolarData, setgradesPolarData] = useState({
    datasets: [
      {
        label: 'Average CAP',
        backgroundColor: [
          'rgba(123, 182, 232, 0.6)',
          'rgba(204, 255, 204, 0.6)',
          'rgba(255, 204, 153, 0.6)',
          'rgba(98, 37, 209, 0.6)',
          'rgba(255, 0, 191, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  })

  useEffect(() => {
    setgradesPolarData({
      labels: topFiveCode,
      datasets: [
        {
          label: 'Average CAP',
          data: topFiveCAP,
          backgroundColor: [
            'rgba(123, 182, 232, 0.6)',
            'rgba(204, 255, 204, 0.6)',
            'rgba(255, 204, 153, 0.6)',
            'rgba(98, 37, 209, 0.6)',
            'rgba(255, 0, 191, 0.6)'
          ],
          borderWidth: 1
        }
      ]
    })
  }, [topFiveCAP])

  /// //////////////////////////////////////////////////////////////////////////////////////////////////
  // Stress //
  /// //////////////////////////////////////////////////////////////////////////////////////////////////

  // Data for mood pie chart

  // Dropdown options to select mood
  const moodInterval = [
    { value: '1', label: 'Past week' },
    { value: '2', label: 'Past month' },
    { value: '3', label: 'Past 6 months' },
    { value: '4', label: 'Past year' },
    { value: '5', label: 'All time' }
  ]

  const moodPieOptions = {
    responsive: true,
    animation: {
      duration: 600
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Breakdown of Stress Levels'
      }
    }
  }

  const [moodPieData, setmoodPieData] = useState({
    labels: ['Very Stressed', 'Stressed', 'Neutral', 'Relaxed', 'Very Relaxed'],
    datasets: [
      {
        label: '%',
        backgroundColor: [
          'rgba(222, 49, 99 , 1)',
          'rgba(255, 127, 80 , 1)',
          'rgba(255, 191, 0, 1)',
          'rgba(88, 214, 141 , 1)',
          'rgba(23, 165, 137 , 1)'
        ],
        borderColor: [
          'rgba(222, 49, 99, 1)',
          'rgba(255, 127, 80 , 1)',
          'rgba(255, 191, 0, 1)',
          'rgba(88, 214, 141 , 1)',
          'rgba(23, 165, 137 , 1)'
        ],
        borderWidth: 1
      }
    ]
  })

  const checkDate = (d, n) => {
    return new Date(yr, mth, date - n).getTime() <= d.toDate().getTime()
  }

  const [stressSelect, setstressSelect] = useState('3')
  const [moodData, setmoodData] = useState([])

  const [oneActivity, setoneActivity] = useState([])
  const [twoActivity, settwoActivity] = useState([])
  const [threeActivity, setthreeActivity] = useState([])
  const [fourActivity, setfourActivity] = useState([])
  const [fiveActivity, setfiveActivity] = useState([])

  const handleSelectStress = (v) => {
    setstressSelect(v)
  }

  const [xLabels, setxLabels] = useState([
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ])
  const [yLabels, setyLabels] = useState(['Poor', 'Ok', 'Good'])
  const moodDatadata = new Array(yLabels.length)
    .fill(0)
    .map(() =>
      new Array(xLabels.length)
        .fill(0)
        .map(() => Math.floor(Math.random() * 10))
    )
  const [data, setData] = useState(moodDatadata)

  useEffect(() => {
    let one = 0
    let two = 0
    let three = 0
    let four = 0
    let five = 0

    setmoodData([])
    const stressSelectHelper = [7, 30, 187, 365, 9999]

    stressData.forEach((i) => {
      if (checkDate(i.date, stressSelectHelper[parseInt(stressSelect) - 1])) {
        if (i.level === 1) {
          one += 1
        }
        if (i.level === 2) {
          two += 1
        }
        if (i.level === 3) {
          three += 1
        }
        if (i.level === 4) {
          four += 1
        }
        if (i.level === 5) {
          five += 1
        }
      }
    })
    setmoodData((moodData) => [...moodData, one])
    setmoodData((moodData) => [...moodData, two])
    setmoodData((moodData) => [...moodData, three])
    setmoodData((moodData) => [...moodData, four])
    setmoodData((moodData) => [...moodData, five])

    for (let x = 1; x <= 5; x++) {
      const stressCounter = {
        Studying: 0,
        'Work + Intern': 0,
        CCA: 0,
        Exercising: 0,
        Socialising: 0,
        Leisure: 0
      }
      stressData.forEach((i) => {
        if (
          checkDate(i.date, stressSelectHelper[parseInt(stressSelect) - 1]) &&
          i.level === x
        ) {
          i.tag.forEach((j) => {
            stressCounter[j] += 1
          })
        }
      })
      const valueArr = []
      Object.keys(stressCounter).map((k, ind) => {
        valueArr.push(stressCounter[k])
      })
      valueArr.sort((a, b) => b - a)
      const foundTags = []
      valueArr.slice(0, 3).forEach((i) => {
        if (i !== 0) {
          Object.keys(stressCounter).map((k, ind) => {
            if (i === stressCounter[k]) {
              foundTags.push(k)
            }
          })
        }
      })
      if (x === 1) {
        setoneActivity([...new Set(foundTags)])
      }
      if (x === 2) {
        settwoActivity([...new Set(foundTags)])
      }
      if (x === 3) {
        setthreeActivity([...new Set(foundTags)])
      }
      if (x === 4) {
        setfourActivity([...new Set(foundTags)])
      }
      if (x === 5) {
        setfiveActivity([...new Set(foundTags)])
      }
    }
  }, [stressSelect])

  useEffect(() => {
    let one = 0
    let two = 0
    let three = 0
    let four = 0
    let five = 0

    setmoodData([])
    const stressSelectHelper = [7, 30, 187, 365, 9999]

    stressData.forEach((i) => {
      if (stressSelect === '3') {
        if (checkDate(i.date, 187)) {
          if (i.level === 1) {
            one += 1
          }
          if (i.level === 2) {
            two += 1
          }
          if (i.level === 3) {
            three += 1
          }
          if (i.level === 4) {
            four += 1
          }
          if (i.level === 5) {
            five += 1
          }
        }
      }
    })

    setmoodData((moodData) => [...moodData, one])
    setmoodData((moodData) => [...moodData, two])
    setmoodData((moodData) => [...moodData, three])
    setmoodData((moodData) => [...moodData, four])
    setmoodData((moodData) => [...moodData, five])

    for (let x = 1; x <= 5; x++) {
      const stressCounter = {
        Studying: 0,
        'Work + Intern': 0,
        CCA: 0,
        Exercising: 0,
        Socialising: 0,
        Leisure: 0
      }
      stressData.forEach((i) => {
        if (
          checkDate(i.date, stressSelectHelper[parseInt(stressSelect) - 1]) &&
          i.level === x
        ) {
          i.tag.forEach((j) => {
            stressCounter[j] += 1
          })
        }
      })
      const valueArr = []
      Object.keys(stressCounter).map((k, ind) => {
        valueArr.push(stressCounter[k])
      })
      valueArr.sort((a, b) => b - a)
      const foundTags = []
      valueArr.slice(0, 3).forEach((i) => {
        if (i !== 0) {
          Object.keys(stressCounter).map((k, ind) => {
            if (i === stressCounter[k]) {
              foundTags.push(k)
            }
          })
        }
      })
      if (x === 1) {
        setoneActivity([...new Set(foundTags)])
      }
      if (x === 2) {
        settwoActivity([...new Set(foundTags)])
      }
      if (x === 3) {
        setthreeActivity([...new Set(foundTags)])
      }
      if (x === 4) {
        setfourActivity([...new Set(foundTags)])
      }
      if (x === 5) {
        setfiveActivity([...new Set(foundTags)])
      }
    }
  }, [stressData])

  useEffect(() => {
    setmoodPieData({
      labels: [
        'Very Stressed',
        'Stressed',
        'Neutral',
        'Relaxed',
        'Very Relaxed'
      ],
      datasets: [
        {
          label: '%',
          data: moodData,
          backgroundColor: [
            'rgba(222, 49, 99 , 1)',
            'rgba(255, 127, 80 , 1)',
            'rgba(255, 191, 0, 1)',
            'rgba(88, 214, 141 , 1)',
            'rgba(23, 165, 137 , 1)'
          ],
          borderColor: [
            'rgba(222, 49, 99, 1)',
            'rgba(255, 127, 80 , 1)',
            'rgba(255, 191, 0, 1)',
            'rgba(88, 214, 141 , 1)',
            'rgba(23, 165, 137 , 1)'
          ],
          borderWidth: 1
        }
      ]
    })
  })

  // All popovers for mood section here
  const [veryStressedPopover, setveryStressedPopover] = useState({})

  const [stressedPopover, setstressedPopover] = useState({})

  const [neutralPopover, setneutralPopover] = useState({})

  const [relaxedPopover, setrelaxedPopover] = useState({})

  const [veryRelaxedPopover, setveryRelaxedPopover] = useState({})

  useEffect(() => {
    setveryStressedPopover(
      <Popover id="popover-basic">
        <Popover.Header as="h3">Very Stressed</Popover.Header>
        <Popover.Body>
          Associated Activities
          <ol>
            {oneActivity.map((i) => {
              return <li>{i}</li>
            })}
          </ol>
        </Popover.Body>
      </Popover>
    )

    setstressedPopover(
      <Popover id="popover-basic">
        <Popover.Header as="h3">Stressed</Popover.Header>
        <Popover.Body>
          Associated Activities
          <ol>
            {twoActivity.map((i) => {
              return <li>{i}</li>
            })}
          </ol>
        </Popover.Body>
      </Popover>
    )

    setneutralPopover(
      <Popover id="popover-basic">
        <Popover.Header as="h3">Neutral</Popover.Header>
        <Popover.Body>
          Associated Activities
          <ol>
            {threeActivity.map((i) => {
              return <li>{i}</li>
            })}
          </ol>
        </Popover.Body>
      </Popover>
    )

    setrelaxedPopover(
      <Popover id="popover-basic">
        <Popover.Header as="h3">Relaxed</Popover.Header>
        <Popover.Body>
          Associated Activities
          <ol>
            {fourActivity.map((i) => {
              return <li>{i}</li>
            })}
          </ol>
        </Popover.Body>
      </Popover>
    )

    setveryRelaxedPopover(
      <Popover id="popover-basic">
        <Popover.Header as="h3">Very Relaxed</Popover.Header>
        <Popover.Body>
          Associated Activities
          <ol>
            {fiveActivity.map((i) => {
              return <li>{i}</li>
            })}
          </ol>
        </Popover.Body>
      </Popover>
    )
  }, [fiveActivity])

  /// //////////////////////////////////////////////////////////////////////////////////////////////////
  // Productivity //
  /// //////////////////////////////////////////////////////////////////////////////////////////////////

  // All data for activity breakdown (productivity section) here

  const prodActivityOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Percentage Breakdown of Activities'
      }
    },
    animation: {
      duration: 300
    },
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true
      }
    }
  }

  const [prodActivityData, setprodActivityData] = useState({})

  // Dropdown options for productivity time interval (used in stacked bar chart)
  const productivityInterval = [
    { value: '1', label: 'Past week' },
    { value: '2', label: 'Past month' },
    { value: '3', label: 'Past year' }
  ]

  const [prodSelect, setprodSelect] = useState('3')

  const [prodLabel, setprodLabel] = useState([])

  const [workProg, setworkProg] = useState(100)
  const [ccaProg, setccaProg] = useState(100)
  const [acadProg, setacadProg] = useState(100)
  const [otherProg, setotherProg] = useState(100)

  const handleProdSelect = (v) => {
    setprodSelect(v)
  }

  const isPresent = (d) => {
    return d.toDate() <= new Date()
  }

  const diffInMinutes = (d1, d2) => {
    return Math.abs(d2 - d1) / (1000 * 60)
  }

  const sameDay = (d1, d2) => {
    return (
      d1.toDate().getFullYear() === d2.toDate().getFullYear() &&
      d1.toDate().getMonth() === d2.toDate().getMonth() &&
      d1.toDate().getDate() === d2.toDate().getDate()
    )
  }

  useEffect(() => {
    if (prodSelect === '1') {
      setprodLabel([])
      for (let i = 0; i <= 6; i++) {
        setprodLabel((prodLabel) => [
          weeks[(7 + (day - i - 1)) % 7],
          ...prodLabel
        ])
      }
    }

    if (prodSelect === '2') {
      setprodLabel([])
      for (let i = 29; i >= 0; i--) {
        const prodDataDate = new Date(yr, mth, date - i)
        setprodLabel((prodLabel) => [
          ...prodLabel,
          prodDataDate.getDate() + '/' + (prodDataDate.getMonth() + 1)
        ])
      }
    }

    if (prodSelect === '3') {
      setprodLabel([])
      for (let i = 11; i >= 0; i--) {
        setprodLabel((prodLabel) => [
          ...prodLabel,
          months[(12 + (mth - i)) % 12]
        ])
      }
    }
  }, [prodSelect])

  const [workData, setworkData] = useState([])
  const [CCAData, setCCAData] = useState([])
  const [acadData, setacadData] = useState([])

  useEffect(() => {
    const prodSelectHelper = [7, 30, 365]
    const taskArr = []

    allEvents.forEach((i) => {
      if (
        checkDate(i.start, prodSelectHelper[parseInt(prodSelect) - 1]) &&
        isPresent(i.end) &&
        sameDay(i.start, i.end)
      ) {
        if (
          i.category === 'Academics' ||
          i.category === 'Work' ||
          i.category === 'Extracurriculars'
        ) {
          taskArr.push(i)
        }
      }
    })

    const E0 = []
    const E1 = []
    const E2 = []
    const E3 = []
    const E4 = []
    const E5 = []
    const E6 = []
    const E7 = []
    const E8 = []
    const E9 = []
    const E10 = []
    const E11 = []
    const E12 = []
    const E13 = []
    const E14 = []
    const E15 = []
    const E16 = []
    const E17 = []
    const E18 = []
    const E19 = []
    const E20 = []
    const E21 = []
    const E22 = []
    const E23 = []
    const E24 = []
    const E25 = []
    const E26 = []
    const E27 = []
    const E28 = []
    const E29 = []
    const E30 = []
    const EJan = []
    const EFeb = []
    const EMar = []
    const EApr = []
    const EMay = []
    const EJun = []
    const EJul = []
    const EAug = []
    const ESep = []
    const EOct = []
    const ENov = []
    const EDec = []

    taskArr.forEach((i) => {
      if (checksDateEqual(i.start, 0)) {
        E0.push(i)
      }
      if (checksDateEqual(i.start, 1)) {
        E1.push(i)
      }
      if (checksDateEqual(i.start, 2)) {
        E2.push(i)
      }
      if (checksDateEqual(i.start, 3)) {
        E3.push(i)
      }
      if (checksDateEqual(i.start, 4)) {
        E4.push(i)
      }
      if (checksDateEqual(i.start, 5)) {
        E5.push(i)
      }
      if (checksDateEqual(i.start, 6)) {
        E6.push(i)
      }
      if (checksDateEqual(i.start, 7)) {
        E7.push(i)
      }
      if (checksDateEqual(i.start, 8)) {
        E8.push(i)
      }
      if (checksDateEqual(i.start, 9)) {
        E9.push(i)
      }
      if (checksDateEqual(i.start, 10)) {
        E10.push(i)
      }
      if (checksDateEqual(i.start, 11)) {
        E11.push(i)
      }
      if (checksDateEqual(i.start, 12)) {
        E12.push(i)
      }
      if (checksDateEqual(i.start, 13)) {
        E13.push(i)
      }
      if (checksDateEqual(i.start, 14)) {
        E14.push(i)
      }
      if (checksDateEqual(i.start, 15)) {
        E15.push(i)
      }
      if (checksDateEqual(i.start, 16)) {
        E16.push(i)
      }
      if (checksDateEqual(i.start, 17)) {
        E17.push(i)
      }
      if (checksDateEqual(i.start, 18)) {
        E18.push(i)
      }
      if (checksDateEqual(i.start, 19)) {
        E19.push(i)
      }
      if (checksDateEqual(i.start, 20)) {
        E20.push(i)
      }
      if (checksDateEqual(i.start, 21)) {
        E21.push(i)
      }
      if (checksDateEqual(i.start, 22)) {
        E22.push(i)
      }
      if (checksDateEqual(i.start, 23)) {
        E23.push(i)
      }
      if (checksDateEqual(i.start, 24)) {
        E24.push(i)
      }
      if (checksDateEqual(i.start, 25)) {
        E25.push(i)
      }
      if (checksDateEqual(i.start, 26)) {
        E26.push(i)
      }
      if (checksDateEqual(i.start, 27)) {
        E27.push(i)
      }
      if (checksDateEqual(i.start, 28)) {
        E28.push(i)
      }
      if (checksDateEqual(i.start, 29)) {
        E29.push(i)
      }
      if (checksDateEqual(i.start, 30)) {
        E30.push(i)
      }
      if (checksMonthEqual(i.start, 0)) {
        EJan.push(i)
      }
      if (checksMonthEqual(i.start, 1)) {
        EFeb.push(i)
      }
      if (checksMonthEqual(i.start, 2)) {
        EMar.push(i)
      }
      if (checksMonthEqual(i.start, 3)) {
        EApr.push(i)
      }
      if (checksMonthEqual(i.start, 4)) {
        EMay.push(i)
      }
      if (checksMonthEqual(i.start, 5)) {
        EJun.push(i)
      }
      if (checksMonthEqual(i.start, 6)) {
        EJul.push(i)
      }
      if (checksMonthEqual(i.start, 7)) {
        EAug.push(i)
      }
      if (checksMonthEqual(i.start, 8)) {
        ESep.push(i)
      }
      if (checksMonthEqual(i.start, 9)) {
        EOct.push(i)
      }
      if (checksMonthEqual(i.start, 10)) {
        ENov.push(i)
      }
      if (checksMonthEqual(i.start, 11)) {
        EDec.push(i)
      }
    })

    const workDataTemp = []
    const CCADataTemp = []
    const acadDataTemp = []

    const prodHelper = (dataArr, workArr, CCAArr, acadArr) => {
      let totalCount = 0
      let workCount = 0
      let CCACount = 0
      let acadCount = 0

      dataArr.forEach((i) => {
        totalCount += diffInMinutes(i.start, i.end)
        if (i.category === 'Work' && i.done) {
          workCount += diffInMinutes(i.start, i.end)
        }
        if (i.category === 'Extracurriculars' && i.done) {
          CCACount += diffInMinutes(i.start, i.end)
        }
        if (i.category === 'Academics' && i.done) {
          acadCount += diffInMinutes(i.start, i.end)
        }
      })
      workArr.push(totalCount !== 0 ? (workCount / totalCount) * 100 : 0)
      CCAArr.push(totalCount !== 0 ? (CCACount / totalCount) * 100 : 0)
      acadArr.push(totalCount !== 0 ? (acadCount / totalCount) * 100 : 0)
    }

    if (prodSelect === '1') {
      [E6, E5, E4, E3, E2, E1, E0].forEach((i) => {
        prodHelper(i, workDataTemp, CCADataTemp, acadDataTemp)
      })
    }
    if (prodSelect === '2') {
      [
        E29,
        E28,
        E27,
        E26,
        E25,
        E24,
        E23,
        E22,
        E21,
        E20,
        E19,
        E18,
        E17,
        E16,
        E15,
        E14,
        E13,
        E12,
        E11,
        E10,
        E9,
        E8,
        E7,
        E6,
        E5,
        E4,
        E3,
        E2,
        E1,
        E0
      ].forEach((i) => {
        prodHelper(i, workDataTemp, CCADataTemp, acadDataTemp)
      })
    }
    if (prodSelect === '3') {
      [
        EDec,
        ENov,
        EOct,
        ESep,
        EAug,
        EJul,
        EJun,
        EMay,
        EApr,
        EMar,
        EFeb,
        EJan
      ].forEach((i) => {
        prodHelper(i, workDataTemp, CCADataTemp, acadDataTemp)
      })
    }

    setworkData(workDataTemp)
    setCCAData(CCADataTemp)
    setacadData(acadDataTemp)
  }, [prodLabel])

  useEffect(() => {
    const prodSelectHelper = [7, 30, 365]
    const taskArr = []

    allEvents.forEach((i) => {
      if (
        checkDate(i.start, prodSelectHelper[parseInt(prodSelect) - 1]) &&
        isPresent(i.end) &&
        sameDay(i.start, i.end)
      ) {
        taskArr.push(i)
      }
    })

    const E0 = []
    const EJan = []
    const EFeb = []
    const EMar = []
    const EApr = []
    const EMay = []
    const EJun = []
    const EJul = []
    const EAug = []
    const ESep = []
    const EOct = []
    const ENov = []
    const EDec = []

    taskArr.forEach((i) => {
      if (checksDateEqual(i.start, 0)) {
        E0.push(i)
      }
      if (
        i.category === 'Academics' ||
        i.category === 'Work' ||
        i.category === 'Extracurriculars'
      ) {
        if (checksMonthEqual(i.start, 0)) {
          EJan.push(i)
        }
        if (checksMonthEqual(i.start, 1)) {
          EFeb.push(i)
        }
        if (checksMonthEqual(i.start, 2)) {
          EMar.push(i)
        }
        if (checksMonthEqual(i.start, 3)) {
          EApr.push(i)
        }
        if (checksMonthEqual(i.start, 4)) {
          EMay.push(i)
        }
        if (checksMonthEqual(i.start, 5)) {
          EJun.push(i)
        }
        if (checksMonthEqual(i.start, 6)) {
          EJul.push(i)
        }
        if (checksMonthEqual(i.start, 7)) {
          EAug.push(i)
        }
        if (checksMonthEqual(i.start, 8)) {
          ESep.push(i)
        }
        if (checksMonthEqual(i.start, 9)) {
          EOct.push(i)
        }
        if (checksMonthEqual(i.start, 10)) {
          ENov.push(i)
        }
        if (checksMonthEqual(i.start, 11)) {
          EDec.push(i)
        }
      }
    })

    const workDataTemp = []
    const CCADataTemp = []
    const acadDataTemp = []

    const prodHelper = (dataArr, workArr, CCAArr, acadArr) => {
      let totalCount = 0
      let workCount = 0
      let CCACount = 0
      let acadCount = 0

      dataArr.forEach((i) => {
        totalCount += diffInMinutes(i.start, i.end)
        if (i.category === 'Work' && i.done) {
          workCount += diffInMinutes(i.start, i.end)
        }
        if (i.category === 'Extracurriculars' && i.done) {
          CCACount += diffInMinutes(i.start, i.end)
        }
        if (i.category === 'Academics' && i.done) {
          acadCount += diffInMinutes(i.start, i.end)
        }
      })
      workArr.push(totalCount !== 0 ? (workCount / totalCount) * 100 : 0)
      CCAArr.push(totalCount !== 0 ? (CCACount / totalCount) * 100 : 0)
      acadArr.push(totalCount !== 0 ? (acadCount / totalCount) * 100 : 0)
    }
    if (prodSelect === '3') {
      [
        EDec,
        ENov,
        EOct,
        ESep,
        EAug,
        EJul,
        EJun,
        EMay,
        EApr,
        EMar,
        EFeb,
        EJan
      ].forEach((i) => {
        prodHelper(i, workDataTemp, CCADataTemp, acadDataTemp)
      })
    }

    setworkData(workDataTemp)
    setCCAData(CCADataTemp)
    setacadData(acadDataTemp)

    let workCount = 0
    let workTotal = 0
    let CCACount = 0
    let CCATotal = 0
    let acadCount = 0
    let acadTotal = 0
    let otherCount = 0
    let otherTotal = 0

    E0.forEach((i) => {
      if (i.category === 'Work') {
        if (i.done) {
          workCount += diffInMinutes(i.start, i.end)
        }
        workTotal += diffInMinutes(i.start, i.end)
      }
      if (i.category === 'Extracurriculars') {
        if (i.done) {
          CCACount += diffInMinutes(i.start, i.end)
        }
        CCATotal += diffInMinutes(i.start, i.end)
      }
      if (i.category === 'Academics') {
        if (i.done) {
          acadCount += diffInMinutes(i.start, i.end)
        }
        acadTotal += diffInMinutes(i.start, i.end)
      }
      if (
        i.category !== 'Work' &&
        i.category !== 'Work' &&
        i.category !== 'Work'
      ) {
        if (i.done) {
          otherCount += diffInMinutes(i.start, i.end)
        }
        otherTotal += diffInMinutes(i.start, i.end)
      }
    })

    setworkProg(
      workTotal !== 0 ? ((workCount / workTotal) * 100).toFixed(0) : 0
    )
    setccaProg(CCATotal !== 0 ? ((CCACount / CCATotal) * 100).toFixed(0) : 0)
    setacadProg(
      acadTotal !== 0 ? ((acadCount / acadTotal) * 100).toFixed(0) : 0
    )
    setotherProg(
      otherTotal !== 0 ? ((otherCount / otherTotal) * 100).toFixed(0) : 0
    )
  }, [allEvents])

  let delayed

  useMemo(() => {
    setprodActivityData({
      labels: prodLabel,
      datasets: [
        {
          label: 'Academics',
          data: acadData,
          backgroundColor: 'rgba(79, 195, 247 )'
        },
        {
          label: 'Work',
          data: workData,
          backgroundColor: 'rgba(111, 247, 79)'
        },
        {
          label: 'CCA',
          data: CCAData,
          backgroundColor: 'rgba(247, 131, 79)'
        }
      ]
    })
  }, [acadData])

  /// //////////////////////////////////////////////////////////////////////////////////////////////////
  // Sleep //
  /// //////////////////////////////////////////////////////////////////////////////////////////////////

  const sleepTimeOptions = {
    responsive: true,
    animation: {
      duration: 500
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Sleep Duration'
      }
    }
  }

  // Dropdown for customising display of heatmap and line chart in the sleep quality section
  const sleepQualityInterval = [
    { value: '1', label: 'Past week' },
    { value: '2', label: 'Past month' },
    { value: '3', label: 'Past year' }
  ]

  const [sleepSelect, setSleepSelect] = useState('3')

  const [sleepLabel, setsleepLabel] = useState([])
  const [sleepQualityData, setsleepQualityData] = useState([])
  const [sleepHoursData, setsleepHoursData] = useState([])

  const handleSleepSelect = (v) => {
    setSleepSelect(v)
  }

  const checksDateEqual = (d, n) => {
    return (
      new Date(yr, mth, date - n).toDateString() === d.toDate().toDateString()
    )
  }

  const checksMonthEqual = (d, n) => {
    const moodDataDate = new Date(yr, mth - n, date)
    return (
      moodDataDate.getMonth() === d.toDate().getMonth() &&
      moodDataDate.getFullYear() === d.toDate().getFullYear()
    )
  }

  useEffect(() => {
    setsleepQualityData([])
    const filteredHours = []

    const poorArr = []
    const okArr = []
    const goodArr = []

    if (sleepSelect === '1') {
      setsleepLabel([])
      for (let i = 0; i <= 6; i++) {
        setsleepLabel((sleepLabel) => [
          weeks[(7 + (day - i - 1)) % 7],
          ...sleepLabel
        ])
      }

      for (let j = 6; j >= 0; j--) {
        let found = false
        let poor = 0
        let ok = 0
        let good = 0
        sleepData.forEach((i) => {
          if (checksDateEqual(i.date, j)) {
            filteredHours.push(i.hours)
            found = true
            if (i.quality === 1) {
              poor += 1
            }
            if (i.quality === 2) {
              ok += 1
            }
            if (i.quality === 3) {
              good += 1
            }
          }
        })
        if (!found) {
          filteredHours.push(NaN)
        }
        poorArr.push(poor)
        okArr.push(ok)
        goodArr.push(good)
      }

      setsleepHoursData(filteredHours)
      setsleepQualityData((sleepQualityData) => [...sleepQualityData, poorArr])
      setsleepQualityData((sleepQualityData) => [...sleepQualityData, okArr])
      setsleepQualityData((sleepQualityData) => [...sleepQualityData, goodArr])
    }

    if (sleepSelect === '2') {
      setsleepLabel([])
      for (let i = 29; i >= 0; i--) {
        if ((i + 1) % 3 === 0) {
          const moodDataDate = new Date(yr, mth, date - i)
          setsleepLabel((sleepLabel) => [
            ...sleepLabel,
            moodDataDate.getDate() + '/' + (moodDataDate.getMonth() + 1)
          ])
        } else {
          setsleepLabel((sleepLabel) => [...sleepLabel, ''])
        }
      }

      for (let j = 29; j >= 0; j--) {
        let found = false
        let poor = 0
        let ok = 0
        let good = 0
        sleepData.forEach((i) => {
          if (checksDateEqual(i.date, j)) {
            filteredHours.push(i.hours)
            found = true
            if (i.quality === 1) {
              poor += 1
            }
            if (i.quality === 2) {
              ok += 1
            }
            if (i.quality === 3) {
              good += 1
            }
          }
        })
        if (!found) {
          filteredHours.push(NaN)
        }
        poorArr.push(poor)
        okArr.push(ok)
        goodArr.push(good)
      }
      setsleepHoursData(filteredHours)
      setsleepQualityData((sleepQualityData) => [...sleepQualityData, poorArr])
      setsleepQualityData((sleepQualityData) => [...sleepQualityData, okArr])
      setsleepQualityData((sleepQualityData) => [...sleepQualityData, goodArr])
    }

    if (sleepSelect === '3') {
      setsleepLabel([])
      for (let i = 11; i >= 0; i--) {
        setsleepLabel((sleepLabel) => [
          ...sleepLabel,
          months[(12 + (mth - i)) % 12]
        ])
      }

      for (let j = 11; j >= 0; j--) {
        const moodDataSleep = []
        let poor = 0
        let ok = 0
        let good = 0
        sleepData.forEach((i) => {
          if (checksMonthEqual(i.date, j)) {
            moodDataSleep.push(i)
            if (i.quality === 1) {
              poor += 1
            }
            if (i.quality === 2) {
              ok += 1
            }
            if (i.quality === 3) {
              good += 1
            }
          }
        })
        filteredHours.push(parseFloat(calcHoursAvg(moodDataSleep)))
        poorArr.push(poor)
        okArr.push(ok)
        goodArr.push(good)
      }
      setsleepHoursData(filteredHours)
      setsleepQualityData((sleepQualityData) => [...sleepQualityData, poorArr])
      setsleepQualityData((sleepQualityData) => [...sleepQualityData, okArr])
      setsleepQualityData((sleepQualityData) => [...sleepQualityData, goodArr])
    }
  }, [sleepSelect])

  useEffect(() => {
    setsleepQualityData([])
    const filteredHours = []
    const poorArr = []
    const okArr = []
    const goodArr = []

    if (sleepSelect === '3') {
      setsleepLabel([])
      for (let i = 0; i <= 11; i++) {
        setsleepLabel((sleepLabel) => [
          ...sleepLabel,
          months[(12 + (mth - i)) % 12]
        ])
      }

      for (let j = 11; j >= 0; j--) {
        const moodDataSleep = []
        let poor = 0
        let ok = 0
        let good = 0
        sleepData.forEach((i) => {
          if (checksMonthEqual(i.date, j)) {
            moodDataSleep.push(i)
            if (i.quality === 1) {
              poor += 1
            }
            if (i.quality === 2) {
              ok += 1
            }
            if (i.quality === 3) {
              good += 1
            }
          }
        })
        filteredHours.push(parseFloat(calcHoursAvg(moodDataSleep)))
        poorArr.push(poor)
        okArr.push(ok)
        goodArr.push(good)
      }
      setsleepHoursData(filteredHours)
      setsleepQualityData((sleepQualityData) => [...sleepQualityData, poorArr])
      setsleepQualityData((sleepQualityData) => [...sleepQualityData, okArr])
      setsleepQualityData((sleepQualityData) => [...sleepQualityData, goodArr])
    }
  }, [sleepData])

  const [sleepTimeData, setsleepTimeData] = useState({
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    datasets: [
      {
        fill: true,
        label: 'Average Duration',
        borderColor: 'rgb(255, 51, 153 )',
        backgroundColor: 'rgba(248, 200, 220,0.3)'
      }
    ]
  })

  useMemo(() => {
    setsleepTimeData({
      labels: sleepLabel,
      datasets: [
        {
          fill: true,
          label: 'Average Duration',
          data: sleepHoursData,
          borderColor: 'rgb(255, 51, 153 )',
          backgroundColor: 'rgba(248, 200, 220,0.3)'
        }
      ]
    })
  }, [sleepHoursData])

  useEffect(() => {
    setxLabels(sleepLabel)
    setData(sleepQualityData)
  }, [sleepQualityData])

  return (
    <>
      <SideBar></SideBar>

      <div className="cardSpacing"></div>

      <Container>
        <Card>
          <Card.Body>
            <Row>
              <div className="acadsAndCAP">
                <div className="acadsRightSpace">
                  <h3>Academics</h3>
                  <Card>
                    <Card.Body>
                      <h5>Discover trends in your academic progress</h5>
                      <em>
                        View an analysis of your CAP, the changes in your CAP,
                        as well as the grades that you can expect for modules
                        taken under your top 5 most commonly occurring module
                        codes
                      </em>
                    </Card.Body>
                  </Card>
                </div>

                <ReactSpeedometer
                  currentValueText="Current CAP: ${value}"
                  valueTextFontSize="10px"
                  labelFontSize="10px"
                  minValue={0}
                  maxValue={5}
                  segments={5}
                  value={subCAP}
                  width={170}
                  height={170}
                />
              </div>
              <Col sm={8}>
                <Chart
                  type="bar"
                  data={gradesMultitypeData}
                  options={gradesMultitypeOptions}
                />
              </Col>

              <Col sm={4}>
                <Row>
                  <PolarArea
                    data={gradesPolarData}
                    options={gradesPolarOptions}
                  />
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>

      <div className="cardSpacing"></div>

      <Container>
        <Card>
          <Card.Body>
            <Row>
              <div className="text-right-end">
                <h3>Stress Management</h3>
              </div>

              <div className="titleSpacing"></div>

              <Col sm={4}>
                <div>
                  <Pie data={moodPieData} options={moodPieOptions} />
                </div>
              </Col>

              <Col sm={8}>
                <div>
                  <Card>
                    <Card.Body>
                      <div className="stressDropdownSpacing">
                        <h5>
                          All your stress levels and their associated triggers,
                          analysed
                        </h5>
                        <em>
                          View patterns in your stress levels here and
                          understand the activities associated with each stress
                          level by hovering your mouse over the emoji buttons
                        </em>
                      </div>

                      <Select
                        defaultValue={{ label: 'Past 6 months', value: '3' }}
                        options={moodInterval}
                        onChange={(event) => handleSelectStress(event.value)}
                      />

                      <div className="center-horizontally-pad-top">
                        <Stack direction="horizontal" gap={5}>
                          <div>
                            <OverlayTrigger
                              trigger="hover"
                              placement="top"
                              overlay={veryStressedPopover}
                            >
                              <Button className="veryStressedEmoji">
                                <div style={{ fontSize: '40px' }}>
                                  &#128555;
                                </div>
                              </Button>
                            </OverlayTrigger>
                          </div>

                          <div>
                            <OverlayTrigger
                              trigger="hover"
                              placement="bottom"
                              overlay={stressedPopover}
                            >
                              <Button className="stressedEmoji">
                                <div style={{ fontSize: '40px' }}>
                                  &#128531;
                                </div>
                              </Button>
                            </OverlayTrigger>
                          </div>

                          <div>
                            <OverlayTrigger
                              trigger="hover"
                              placement="top"
                              overlay={neutralPopover}
                            >
                              <Button className="neutralEmoji">
                                <div style={{ fontSize: '40px' }}>
                                  &#128528;
                                </div>
                              </Button>
                            </OverlayTrigger>
                          </div>

                          <div>
                            <OverlayTrigger
                              trigger="hover"
                              placement="bottom"
                              overlay={relaxedPopover}
                            >
                              <Button className="relaxedEmoji">
                                <div style={{ fontSize: '40px' }}>
                                  &#128524;
                                </div>
                              </Button>
                            </OverlayTrigger>
                          </div>

                          <div>
                            <OverlayTrigger
                              trigger="hover"
                              placement="top"
                              overlay={veryRelaxedPopover}
                            >
                              <Button className="veryRelaxedEmoji">
                                <div style={{ fontSize: '40px' }}>
                                  &#128522;
                                </div>
                              </Button>
                            </OverlayTrigger>
                          </div>
                        </Stack>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>

      <div className="cardSpacing"></div>

      <Container>
        <Card>
          <Card.Body>
            <h3>Productivity</h3>
            <div className="titleSpacing"></div>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <h5>Your progress of today's tasks, sorted by category </h5>
                    <em>
                      Keep working towards a 100% progress bar by completing the
                      tasks that you have planned for today
                    </em>
                  </Card.Body>
                </Card>
              </Col>

              <Col>
                <table>
                  <tr>
                    <td>
                      <h6>Work</h6>
                    </td>
                    <td className="full-width">
                      <ProgressBar
                        variant="work"
                        now={workProg}
                        label={workProg}
                      ></ProgressBar>
                    </td>
                  </tr>

                  <td>
                    <h6>CCA</h6>
                  </td>
                  <td className="full-width">
                    <ProgressBar
                      variant="cca"
                      now={ccaProg}
                      label={ccaProg}
                    ></ProgressBar>
                  </td>

                  <tr>
                    <td>
                      <h6>Academics&emsp;</h6>
                    </td>
                    <td className="full-width">
                      <ProgressBar
                        variant="academics"
                        now={acadProg}
                        label={acadProg}
                      ></ProgressBar>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h6>Others</h6>
                    </td>
                    <td className="full-width">
                      <ProgressBar
                        variant="others"
                        now={otherProg}
                        label={otherProg}
                      ></ProgressBar>
                    </td>
                  </tr>
                </table>
              </Col>
            </Row>

            <Row>
              <Col xs={8}>
                <Bar options={prodActivityOptions} data={prodActivityData} />
              </Col>

              <Col xs={4}>
                <div className="prodSpacing"></div>
                <Card>
                  <Card.Body>
                    <h5>
                      The distribution of your time, across 3 important
                      categories
                    </h5>
                    <em>
                      Select an option in the dropdown below to customise the
                      time frame that the graph spans across
                    </em>

                    <div className="prodDropdownSpacing"></div>
                    <Select
                      defaultValue={{ label: 'Past year', value: '3' }}
                      options={productivityInterval}
                      onChange={(event) => handleProdSelect(event.value)}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>

      <div className="cardSpacing"></div>

      <Container>
        <Card>
          <Card.Body>
            <h3 className="text-right-end">Sleep Quality</h3>
            <div className="titleSpacing"></div>
            <HeatMap
              xLabels={xLabels}
              yLabels={yLabels}
              yLabelWidth={50}
              data={data}
              cellStyle={(background, value, min, max, data, x, y) => ({
                background: `rgb(239, 108, 0  , ${
                  1 - (max - value) / (max - min)
                })`,
                fontSize: '11.5px',
                color: '#000'
              })}
              cellRender={(value) => value && <div>{value}</div>}
            />

            <div className="titleSpacing"></div>
            <Container>
              <Row>
                <Col xs={4}>
                  <div className="sleep-second-row">
                    <Card>
                      <Card.Body>
                        <h5>
                          Your sleep quality, evaluated in categorical and
                          numerical terms
                        </h5>
                        <em>
                          Select an option in the dropdown below to customise
                          the time frame that both graphs span across
                        </em>
                        <div className="prodDropdownSpacing"></div>
                        <Select
                          defaultValue={{ label: 'Past year', value: '3' }}
                          options={sleepQualityInterval}
                          onChange={(event) => handleSleepSelect(event.value)}
                        />
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
                <Col xs={8}>
                  <Line options={sleepTimeOptions} data={sleepTimeData} />
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Container>

      <div className="cardSpacing"></div>
    </>
  )
}
