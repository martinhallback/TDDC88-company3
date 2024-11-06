from flask import Blueprint
from .cameras_controller import CameraController

cameras_bp = Blueprint("cameras", __name__)


@cameras_bp.route("/", methods=["GET"])
def get_cameras():
    return CameraController.get_cameras()


@cameras_bp.route("/add", methods=["POST"])
def add_camera(camera_id):
    return CameraController.add_camera(camera_id)


@cameras_bp.route("/<string:camera_id>", methods=["GET"])
def get_camera_by_id(camera_id):
    return CameraController.get_camera(camera_id)


@cameras_bp.route("/<string:camera_id>", methods=["DELETE"])
def delete_camera_by_id(camera_id):
    return CameraController.delete_camera(camera_id)


@cameras_bp.route("/upload/data", methods=["POST"])
def process_camera_data():
    return CameraController.process_camera_data()