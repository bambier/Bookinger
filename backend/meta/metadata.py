from rest_framework.metadata import BaseMetadata


class Metadata(BaseMetadata):
    """
    Don't include field and other information for `OPTIONS` requests.
    Just return the name and description.
    """

    def determine_metadata(self, request, view):
        return {
        }
