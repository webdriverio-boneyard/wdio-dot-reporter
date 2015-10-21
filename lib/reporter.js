import events from 'events'

/**
 * Initialize a new `Dot` matrix test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
class DotReporter extends events.EventEmitter {
    constructor (baseReporter) {
        super()

        this.baseReporter = baseReporter
        const { epilogue } = this.baseReporter

        this.on('start', () => {
            console.log()
        })

        this.on('test:pending', () => {
            this.printDots('pending')
        })

        this.on('test:pass', () => {
            this.printDots('green')
        })

        this.on('test:fail', () => {
            this.printDots('fail')
        })

        this.on('test:end', () => {
            this.printDots(null)
        })

        this.on('end', () => {
            epilogue.call(baseReporter)
            console.log()
        })
    }

    checkIfTestHasPassed (i) {
        const { stats } = this.baseReporter
        let hasPassed = true

        for (let pid of Object.keys(stats.runner)) {
            let runner = stats.runner[pid]

            if (i > runner.tests.length - 1) {
                continue
            }

            hasPassed = hasPassed && runner.tests[i] === null
        }
        return hasPassed
    }

    printDots (status) {
        const { stats, cursor, color, symbols } = this.baseReporter

        let tests = null
        let minExecutedTests = null

        for (let pid of Object.keys(stats.runner)) {
            let runner = stats.runner[pid]
            tests = Math.max(tests || runner.tests.length, runner.tests.length)
            minExecutedTests = Math.min(minExecutedTests || runner.tests.length, runner.tests.length)
        }

        if (!cursor.isatty) {
            return status && process.stdout.write(symbols.dot)
        }

        cursor.beginningOfLine()
        for (let i = 0; i < tests; ++i) {
            let hasTestPassed = this.checkIfTestHasPassed(i)

            if (minExecutedTests <= i) {
                process.stdout.write(color(hasTestPassed ? 'medium' : 'fail', symbols.dot))
            } else {
                process.stdout.write(color(hasTestPassed ? 'green' : 'fail', hasTestPassed ? symbols.dot : symbols.error))
            }
        }
    }
}

export default DotReporter
