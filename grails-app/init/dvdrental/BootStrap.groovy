package dvdrental

import com.nxp.gps.dvdrental.Actor

class BootStrap {

    def init = { servletContext ->
        log.error "Actor.count: ${Actor.count()}"
        if (Actor.count() == 0) {
            Actor.withTransaction {session->
                log.error "Session ${session}"
                new Actor (firstName: 'Roger', lastName: 'Moore').save(flush: true, failOnError: true)
                new Actor (firstName: 'Sean', lastName: 'Connery').save(flush: true, failOnError: true)
                new Actor (firstName: 'Timothy', lastName: 'Dalton').save(flush: true, failOnError: true)
                new Actor (firstName: 'Pierce', lastName: 'Bronson').save(flush: true, failOnError: true)
                new Actor (firstName: 'Daniel', lastName: 'Craig').save(flush: true, failOnError: true)
            }

            log.error "!Actor.count: ${Actor.count()}"
        }
    }
    def destroy = {
    }
}
