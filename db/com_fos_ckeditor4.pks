create or replace package com_fos_ckeditor4
as

    procedure render
      ( p_item apex_plugin.t_item
      , p_plugin in            apex_plugin.t_item
      , p_plugin in            apex_plugin.t_plugin
      , p_param  in            apex_plugin.t_item_render_param
      , p_result in out nocopy apex_plugin.t_item_render_result
      );

end;
/


