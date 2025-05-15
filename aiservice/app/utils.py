import logging

# Configure basic logging to console
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=None  # Let basicConfig handle the default StreamHandler to stdout
)

# Get a logger instance for this module
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    # Example usage
    log_utils = logging.getLogger("utils_module") # Get a specific logger
    log_utils.info("This info is from the utils module.")
    log_utils.debug("This debug won't show by default.")
    log_utils.error("An error occurred in utils.")

    logger.warning("This warning is using the default logger from utils.")