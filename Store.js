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
    maxViews: 3,
    archive: '',
    archives: [],
    fetching: {},

    isUploading: false,
    isLoading: true,
    isDragging: false,
    isShareable: typeof navigator.share === 'function',
    isCompressing: false,

    session: supabase.auth.session()
};

export default proxy(TEMPLATE);
export {
    TEMPLATE
};