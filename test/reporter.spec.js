import sinon from 'sinon'
import events from 'events'
import DotReporter from '../lib/reporter'

class BaseReporter extends events.EventEmitter {
}

let baseReporterMock = new BaseReporter()
let reporter, logMock, printDotsMock, epilogueMock

describe('dot reporter', () => {
    beforeEach(() => {
        logMock = sinon.spy()
        printDotsMock = sinon.spy()
        epilogueMock = sinon.spy()

        DotReporter.__set__('console', {
            log: logMock
        })

        baseReporterMock.epilogue = epilogueMock
        baseReporterMock.printDots = printDotsMock

        reporter = new DotReporter(baseReporterMock)
    })

    it('should print \\n when suite starts', () => {
        reporter.emit('start')
        logMock.called.should.be.true
    })

    it('should print \\n and call baseReporters epilogue when suite ends', () => {
        reporter.emit('end')
        logMock.called.should.be.true()
        epilogueMock.called.should.be.true()
    })

    it('should print pending dots for pending events', () => {
        reporter.printDots = sinon.spy()
        reporter.emit('test:pending')
        reporter.printDots.calledWith('pending').should.be.true
    })

    it('should print green dots for passing events', () => {
        reporter.printDots = sinon.spy()
        reporter.emit('test:pass')
        reporter.printDots.calledWith('green').should.be.true
    })

    it('should print fail dots for failing events', () => {
        reporter.printDots = sinon.spy()
        reporter.emit('test:fail')
        reporter.printDots.calledWith('fail').should.be.true
    })

    it('should print pending dots for pending events', () => {
        reporter.printDots = sinon.spy()
        reporter.emit('test:pending')
        reporter.printDots.calledWith('pending').should.be.true
    })
})
