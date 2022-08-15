package com.nxp.gps.dvdrental

import grails.databinding.SimpleMapDataBindingSource
import grails.gorm.transactions.Transactional
import grails.rest.*
import grails.converters.*
import grails.util.TypeConvertingMap
import grails.web.databinding.GrailsWebDataBinder
import org.grails.web.json.JSONObject


class ActorController {
	static responseFormats = ['json', 'xml']
    GrailsWebDataBinder grailsWebDataBinder
	
    def index() {
        def actors = Actor.findAll([max: 200, offset: 0, sort: "id", order: "asc"])
        log.error "Actors: ${actors?.size()}"
        actors.each {
            log.error it.toString()
        }
        def count = Actor.count
        [actors: actors, count:count]
    }

    /**
     *  curl -i -X PUT -H "Content-Type: application/json" -d '{"firstName":"Pen"}' localhost:8080/actor/1
     *
     * @return
     */
    @Transactional
    def update() {
        JSONObject json = (JSONObject)request.getJSON()

        def jsonMap = new TypeConvertingMap(json)

        Actor actor = Actor.findById(Integer.valueOf(params.id))

        if (!actor) {
            return [success: false, message: "No actor found for ${params.id}"]
        }

        jsonMap.lastUpdate = new Date()
        grailsWebDataBinder.bind(actor, new SimpleMapDataBindingSource(jsonMap))

        if (actor.hasErrors()) {
            actor.discard()
            return actor
        }

        // Make sure the request still exists (in case it was previously deleted) before trying to save...
        if (Actor.exists(actor.id)) {
            actor.save(flush: true, failOnError: true)
        }
        actor

        [success: true, actor: actor]

    }


}
