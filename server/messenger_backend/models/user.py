import base64
import hashlib
import os

from django.db import models

from . import utils


class User(utils.CustomModel):
    username = models.TextField(null=False, unique=True)
    email = models.TextField(null=False, unique=True)
    photoUrl = models.TextField()
    password = models.TextField(null=False)
    salt = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    @property
    def is_anonymous(self):
        """To work with django's AnonymousUser workflow"""
        return False

    @staticmethod
    def get_by_id(id: int):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None

    def create_salt(self):
        result = os.urandom(16)
        return base64.b64encode(result)

    def encrypt_password(self, plain_password: str, salt: str):
        hash_creator = hashlib.sha256()
        hash_creator.update(plain_password.encode("utf-8"))
        hash_creator.update(salt.encode("utf-8"))
        return hash_creator.hexdigest()

    def set_salt_and_password(self):
        self.salt = self.create_salt().decode("utf-8")
        self.password = self.encrypt_password(self.password, self.salt)

    def save(self, *args, **kwargs):
        self.set_salt_and_password()
        super(User, self).save(*args, **kwargs)

    def verify_password(self, password: str):
        if self.encrypt_password(password, self.salt) == self.password:
            return True
        else:
            return False
