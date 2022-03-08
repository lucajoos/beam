import { proxy } from 'valtio';
import supabase from './src/modules/supabase';

const TEMPLATE = {
    authentication: {
        email: '',
        isLoading: false
    },

    modal: {
        content: '',
        isVisible: false
    },

    files: {},
    url: '',
    archive: '',
    archives: [],

    isUploading: false,
    isLoading: true,
    isDragging: false,
    isShareable: typeof navigator.share === 'function',

    session: supabase.auth.session()
};

export default proxy(TEMPLATE);
export {
    TEMPLATE
};