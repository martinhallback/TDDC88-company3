# This file contains the service layer for the alarms module

from app.models import * # Import the Alarm model
from typing import List
from app.extensions import db # Import the database instance


class AlarmService:
    def get_alarms() -> List[Alarm]:     
        alarms = Alarm.query.all()
        return [alarm.to_dict() for alarm in alarms]

    def create_alarm(alarm_data):
        new_alarm = Alarm(
            camera_id=alarm_data["camera_id"],
            confidence_score=alarm_data["confidence_score"],
            timestamp=alarm_data["timestamp"],
            image_snapshot_id=alarm_data["image_snapshot_id"],
            video_clip_id=alarm_data["video_clip_id"],
            #ToDO: snapshot_string?
            #ToDo: type?
            status="pending", # Set default status to "pending"
            operator_id=alarm_data["operator_id"],
        )
        db.session.add(new_alarm)
        db.session.commit()
        return new_alarm

    def get_alarm_by_id(schedule_id):
        return  # add logic
    
    def update_alarm_status(alarm_id, new_status):
    # Find the alarm by ID
        alarm = Alarm.query.get(alarm_id)
        if alarm:
            # Check if the status is valid
            if new_status not in [status.value for status in AlarmStatus]:
                return None  # Invalid status
            
            # Update the alarm status
            alarm.status = AlarmStatus[new_status.upper()]  # Convert string to enum
            db.session.commit()
            return alarm.to_dict()  # Return the updated alarm as a dictionary
        return None  # Alarm not found


    def delete_alarm_by_id(schedule_id):
        #    alarm = AlarmController.get_alarm_by_id(alarm_id)
        #    if alarm:
        #        return jsonify(alarm)
        #    else:
        #        return jsonify({"message": "Alarm not found"})
        #        return jsonify({"alarm_id": str(alarm_id)})
        return  # add logic
