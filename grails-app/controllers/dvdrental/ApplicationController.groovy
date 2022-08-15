package dvdrental

import com.nxp.gps.dvdrental.Actor
import grails.core.GrailsApplication
import grails.plugins.*

class ApplicationController implements PluginManagerAware {

    GrailsApplication grailsApplication
    GrailsPluginManager pluginManager

    def index() {
        log.error "${Actor.count}"
         def actors = Actor.list()
        actors.each {actor->
            log.error "${actor?.dump()}"
        }

        [grailsApplication: grailsApplication, pluginManager: pluginManager]
    }
}
