from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import todo
from .serializers import RegisterSerializer, Todo_ser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message": "User registered successfully!", "user": serializer.data}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            error_message = self.format_validation_error(e)
            return Response({"message": error_message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def format_validation_error(self, exception):
        """Format ValidationError to extract and clean up the error message."""
        errors = exception.detail
        error_messages = []
        for field, messages in errors.items():
            for message in messages:
                error_messages.append(str(message))
        return " ".join(error_messages)

class TodoListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = Todo_ser  
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['title']

    def get_queryset(self):
        try:
            return todo.objects.filter(user=self.request.user)
        except Exception as e:
            return Response({"error": f"Error retrieving data: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            raise Exception(f"Error saving data: {str(e)}")

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            return Response({"message": "Todo item created successfully!", "data": response.data}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            error_message = self.format_validation_error(e)
            return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

class TodoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = Todo_ser

    def get_queryset(self):
        try:
            return todo.objects.filter(user=self.request.user)
        except Exception as e:
            return Response({"error": f"Error retrieving data: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', True)
            instance = self.get_object()

            data = request.data.copy()
            data.pop('user', None)

            serializer = self.get_serializer(instance, data=data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return Response({"message": "Todo item updated successfully!", "data": serializer.data}, status=status.HTTP_200_OK)
        except ValidationError as e:
            error_message = self.format_validation_error(e)
            return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            raise Exception(f"Error updating data: {str(e)}")

    def destroy(self, request, *args, **kwargs):
        try:
            super().destroy(request, *args, **kwargs)
            return Response({"message": "Todo item deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        try:
            response = super().retrieve(request, *args, **kwargs)
            return Response({"message": "Todo item retrieved successfully!", "data": response.data}, status=status.HTTP_200_OK)
        except ValidationError as e:
            error_message = self.format_validation_error(e)
            return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def format_validation_error(self, exception):
        """Format ValidationError to extract and clean up the error message."""
        errors = exception.detail
        error_messages = []
        for field, messages in errors.items():
            for message in messages:
                error_messages.append(str(message))
        return " ".join(error_messages)
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")

            # Blacklist the refresh token
            refresh_token_instance = RefreshToken(refresh_token)
            refresh_token_instance.blacklist()

            return Response({"message": "Logout successful!"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)








# Create your views here.
