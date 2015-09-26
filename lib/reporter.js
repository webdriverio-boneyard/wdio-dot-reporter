/**
 * Initialize a new `Dot` matrix test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
class DotReporter {
    constructor (baseReporter) {
        baseReporter.call(this)

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
            this.epilogue()
            console.log()
        })
    }

    checkIfTestHasPassed (i) {
        let hasPassed = true

        for (let pid of Object.keys(this.stats.runner)) {
            let runner = this.stats.runner[pid]

            if (i > runner.tests.length - 1) {
                return
            }

            hasPassed = hasPassed && runner.tests[i] === null
        }
        return hasPassed
    }

    printDots (color) {
        let tests = null
        let minExecutedTests = null

        for (let pid of Object.keys(this.stats.runner)) {
            let runner = this.stats.runner[pid]
            tests = Math.max(tests || runner.tests.length, runner.tests.length)
            minExecutedTests = Math.min(minExecutedTests || runner.tests.length, runner.tests.length)
        }

        /**
         * no fancy spinner without tty
         */
        if (!this.cursor.isatty) {
            this.spinner = true
            color && process.stdout.write(this.color(color, this.symbols.dot))
            return
        }

        this.cursor.beginningOfLine()
        for (let i = 0; i < tests; ++i) {
            let hasTestPassed = this.checkIfTestHasPassed(i)

            if (minExecutedTests <= i) {
                process.stdout.write(this.color(hasTestPassed ? 'medium' : 'fail', this.symbols.dot))
            } else {
                process.stdout.write(this.color(hasTestPassed ? 'green' : 'fail', hasTestPassed ? this.symbols.dot : this.symbols.error))
            }
        }
    }
}

export default DotReporter
