from rest_framework import status
from rest_framework.test import APITestCase


class AuthenticationTestCase(APITestCase):
    def setUp(self):
        self.user_data = {
            "username": "test-user",
            "email": "test@mail.com",
            "password": "123456",
        }

    def test_not_authenticated_protected_endpoint(self):
        """Try to access a protected endpoint without a token"""

        response = self.client.get(f"/api/users/{self.user_data['username']}")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_protected_endpoint(self):
        """Try to access a protected endpoint with a valid token"""

        # Register a user
        register_response = self.client.post(
            "/auth/register", data=self.user_data, format="json"
        )
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        data = register_response.json()
        self.assertIn("token", data)

        # Access protected route with credentials
        users_response = self.client.get(
            f"/api/users/{self.user_data['username']}",
            format="json",
            **{"HTTP_X-ACCESS-TOKEN": data.get("token")},
        )
        self.assertEqual(users_response.status_code, status.HTTP_200_OK)

        data = users_response.json()
        self.assertEqual(data, [])