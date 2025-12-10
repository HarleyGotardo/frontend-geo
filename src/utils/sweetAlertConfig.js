import Swal from 'sweetalert2';

// Global SweetAlert configuration
Swal.mixin({
  customClass: {
    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    cancelButton: 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    actions: 'gap-3',
    popup: 'rounded-lg shadow-lg'
  },
  buttonsStyling: false, // Disable default styling to use our custom classes
  showClass: {
    popup: 'animate__animated animate__fadeInDown'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp'
  }
});

export const sweetAlertService = {
  // Generic confirmation dialog for non-delete actions
  confirmAction: async (title, text, confirmButtonText = 'Confirm', isDestructive = false) => {
    return Swal.fire({
      title: title,
      html: `
        <div class="text-center">
          <p class="text-gray-700 mb-2">${text}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        confirmButton: isDestructive 
          ? 'bg-red-600 hover:bg-red-700 text-white font-medium rounded-md px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
          : 'bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        cancelButton: 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
        actions: 'gap-3',
        popup: 'rounded-lg shadow-lg'
      },
      buttonsStyling: false
    });
  },

  // Delete confirmation dialog
  confirmDelete: async (itemCount, itemType = 'item', customMessage = null) => {
    return Swal.fire({
      title: 'Delete Selected Items?',
      html: `
        <div class="text-center">
          <p class="text-gray-700 mb-2">
            ${customMessage || `Are you sure you want to delete <strong class="text-red-600">${itemCount}</strong> ${itemType}${itemCount !== 1 ? 's' : ''}?`}
          </p>
          <p class="text-gray-500 text-sm">
            This action cannot be undone.
          </p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Delete ${itemCount} ${itemType}${itemCount !== 1 ? 's' : ''}`,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-medium rounded-md px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        cancelButton: 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
        actions: 'gap-3',
        popup: 'rounded-lg shadow-lg'
      },
      buttonsStyling: false
    });
  },

  // Success dialog
  showSuccess: (title, message, timer = 2000) => {
    return Swal.fire({
      title,
      html: `<p class="text-gray-700">${message}</p>`,
      icon: 'success',
      timer,
      timerProgressBar: true,
      showConfirmButton: false
    });
  },

  // Error dialog
  showError: (title, message) => {
    return Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc2626'
    });
  },

  // Info dialog
  showInfo: (title, message) => {
    return Swal.fire({
      title,
      html: `<p class="text-gray-700">${message}</p>`,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  },

  // Warning dialog
  showWarning: (title, message) => {
    return Swal.fire({
      title,
      html: `<p class="text-gray-700">${message}</p>`,
      icon: 'warning',
      confirmButtonText: 'Continue',
      confirmButtonColor: '#f59e0b'
    });
  },

  // Loading dialog
  showLoading: (title = 'Loading...') => {
    return Swal.fire({
      title,
      html: '<div class="text-gray-500">Please wait while we process your request.</div>',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  },

  // Close current dialog
  close: () => {
    Swal.close();
  }
};

export default sweetAlertService;
