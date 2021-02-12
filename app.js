require('dotenv').config()


const express = require("express")
const config = require("config")
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || config.get('port')

app.use(express.json({extended: true}))
app.use(cors())
app.use(express.static('public'))

app.use('/', require('./routes/user.route'))
app.use('/', require('./routes/group.route'))
app.use('/', require('./routes/subject.route'))
app.use('/', require('./routes/program.route'))
app.use('/', require('./routes/theme.route'))
app.use('/', require('./routes/grade.route'))

/*app.use('/api/', require('./routes/user.route'))
app.use('/api/', require('./routes/subject.route'))
app.use('/api/', require('./routes/specialty.route'))*/

app.get('/', (req, res) => {
    res.end('<h1>journal.api</h1>')
})

app.listen(PORT, () => {
    console.log(`App has been started on port ${PORT}...`)
});