create or replace package body com_fos_ckeditor4
as

-- =============================================================================
--
--  FOS = FOEX Open Source (fos.world), by FOEX GmbH, Austria (www.foex.at)
--
--  This plug-in offers a Rich Text Editor based on CKEditor4.
--
--  License: MIT
--
--  GitHub: https://github.com/foex-open-source/fos-ckeditor4
--
-- =============================================================================

procedure render
  ( p_item   in            apex_plugin.t_item
  , p_plugin in            apex_plugin.t_plugin
  , p_param  in            apex_plugin.t_item_render_param
  , p_result in out nocopy apex_plugin.t_item_render_result
  )
as
    c_name     constant apex_plugin.t_input_name := apex_plugin.get_input_name_for_item;
    c_path     constant varchar2(4000)           := nvl(p_plugin.attribute_01, 'https://cdn.ckeditor.com/4.15.1/full-all/');
    c_toolbar  constant varchar2(30)             := nvl(p_item.attribute_01, 'full');
begin
    if p_param.value_set_by_controller and p_param.is_readonly
    then
        return;
    end if;

    if p_param.is_readonly or p_param.is_printer_friendly
    then
        apex_plugin_util.print_hidden_if_readonly
          ( p_item  => p_item
          , p_param => p_param
          );

        apex_plugin_util.print_display_only
          ( p_item             => p_item
          , p_display_value    => p_param.value
          , p_show_line_breaks => true
          , p_escape           => false
          , p_show_icon        => false
          );
    else
        -- create Textarea which will hold the initial value
        sys.htp.formtextareaopen
          ( cname       => c_name
          , nrows       => null
          , ncolumns    => null
          , cattributes => 'id="' || c_name || '" class="rich_text_editor apex-item-textarea"'
          );

        apex_plugin_util.print_escaped_value(p_param.value);

        sys.htp.formtextareaclose;

        -- add needed libraries
        apex_javascript.add_library
          ( p_name      => 'ckeditor'
          , p_directory => c_path
          );

        apex_javascript.add_library
          ( p_name      => 'jquery'
          , p_directory => c_path || '/adapters/'
          );

        apex_json.initialize_clob_output;

        -- compose JSON
        apex_json.open_object;
        apex_json.write('itemName', p_item.name);
        apex_json.write('label', p_item.plain_label);
        apex_json.write('toolbar', c_toolbar);

        if p_item.init_javascript_code is not null
        then
            apex_json.write_raw('jsInitCode', p_item.init_javascript_code);
        end if;

        apex_json.close_object;

        apex_javascript.add_onload_code('FOS.item.ckeditor4(' || apex_json.get_clob_output || ');');

        apex_json.free_output;

        p_result.is_navigable := true;
    end if;
end;

end;
/


